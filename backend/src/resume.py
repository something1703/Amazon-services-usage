import json
import uuid
import os
from bedrock_helper import invoke_bedrock
import boto3

s3 = boto3.client('s3')
OUTPUTS_BUCKET = os.environ['S3_BUCKET_OUTPUTS']

def build_resume_prompt(user_inputs):
    system = "You are a professional ATS-friendly resume writer. Output JSON with fields: html, sections..."
    user = f"User inputs: {json.dumps(user_inputs)}. Generate two variants. Return only JSON."
    return system + "\n\n" + user

def lambda_handler(event, context):
    body = json.loads(event.get('body','{}'))
    user_inputs = body.get('user', {})
    prompt = build_resume_prompt(user_inputs)
    response = invoke_bedrock(prompt, model='your-bedrock-model-id')
    try:
        data = json.loads(response)
    except Exception:
        return {"statusCode":500, "body": json.dumps({"error":"Bedrock produced non-json", "raw": response})}

    # assume data has 'html' and maybe 'pdf_base64'
    html = data.get('html','')
    resume_id = uuid.uuid4().hex
    key_html = f"resumes/{resume_id}.html"
    s3.put_object(Bucket=OUTPUTS_BUCKET, Key=key_html, Body=html, ContentType='text/html')

    # if Bedrock returned a base64 pdf (optional), save it; else return html URL
    pdf_b64 = data.get('pdf_base64')
    if pdf_b64:
        import base64
        pdf_bytes = base64.b64decode(pdf_b64)
        key_pdf = f"resumes/{resume_id}.pdf"
        s3.put_object(Bucket=OUTPUTS_BUCKET, Key=key_pdf, Body=pdf_bytes, ContentType='application/pdf')
        pdf_url = s3.generate_presigned_url('get_object', Params={'Bucket':OUTPUTS_BUCKET,'Key':key_pdf}, ExpiresIn=3600)
    else:
        pdf_url = None

    html_url = s3.generate_presigned_url('get_object', Params={'Bucket':OUTPUTS_BUCKET,'Key':key_html}, ExpiresIn=3600)
    return {"statusCode":200, "body": json.dumps({"resume_id": resume_id, "html_url": html_url, "pdf_url": pdf_url})}
