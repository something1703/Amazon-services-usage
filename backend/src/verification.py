import json, os, boto3, base64
from datetime import datetime
import Levenshtein

s3 = boto3.client('s3')
textract = boto3.client('textract')
dynamodb = boto3.resource('dynamodb')

UPLOADS_BUCKET = os.environ['S3_BUCKET_UPLOADS']

def extract_text_from_image_bytes(image_bytes):
    resp = textract.analyze_document(Document={'Bytes': image_bytes}, FeatureTypes=['FORMS','TABLES'])
    # basic parsing: get key-value pairs from blocks
    blocks = resp.get('Blocks', [])
    k = {}
    # very basic form field extraction:
    for b in blocks:
        if b.get('BlockType') == 'KEY_VALUE_SET' and b.get('EntityTypes') and 'KEY' in b.get('EntityTypes'):
            # get key text and value text (skipping robust mapping for brevity)
            pass
    # For MVP fallback: run DetectDocumentText to get raw lines
    resp2 = textract.detect_document_text(Document={'Bytes': image_bytes})
    lines = [l['DetectedText'] for l in resp2.get('Blocks',[]) if l['BlockType']=='LINE']
    return " ".join(lines)

def compare_resume_with_extracted(resume_json, extracted_text):
    # simple heuristics: search for GPA/percentage and name strings
    report = []
    score = 100
    # Name check
    resume_name = resume_json.get('name','').lower()
    if resume_name:
        name_found = resume_name in extracted_text.lower()
        if not name_found:
            # try fuzzy match
            ratio = Levenshtein.ratio(resume_name, extracted_text.lower())
            if ratio < 0.6:
                report.append({"field":"name","match":False,"detail":"Name not found or low similarity"})
                score -= 40
    # Score check (search numbers)
    # This is simplistic; adapt per actual Textract structured fields
    return {"score": max(0, score), "issues": report}

def lambda_handler(event, context):
    # Expect multipart via base64 fields: resume_json, docs: array of {filename, base64}
    body = json.loads(event.get('body','{}'))
    resume_json = body.get('resume_json', {})
    docs = body.get('docs', [])
    aggregated_text = ""
    for doc in docs:
        b64 = doc.get('base64')
        if not b64:
            continue
        img_bytes = base64.b64decode(b64)
        text = extract_text_from_image_bytes(img_bytes)
        aggregated_text += " " + text
    comparison = compare_resume_with_extracted(resume_json, aggregated_text)
    # For human readable explanation, you can call Bedrock to produce a narrative (not required for MVP)
    return {"statusCode":200, "body": json.dumps({"comparison": comparison})}
