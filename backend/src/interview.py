import json
from bedrock_helper import invoke_bedrock

def build_interview_prompt(company, role, count=12):
    system = f"You are an expert interview coach for {company}, role {role}..."
    user = f"Generate {count} technical questions plus 3 HR questions. Return JSON with schema: questions[] with fields text, ideal_answer, difficulty, followups[]"
    prompt = system + "\n\n" + user
    return prompt

def lambda_handler(event, context):
    body = json.loads(event.get('body','{}'))
    company = body.get('company','Amazon')
    role = body.get('role','SDE')
    prompt = build_interview_prompt(company, role)
    model_response = invoke_bedrock(prompt, model='your-bedrock-model-id')
    # model_response should be JSON string; try to parse
    try:
        out = json.loads(model_response)
    except Exception:
        out = {"raw": model_response}
    return {"statusCode":200, "body": json.dumps(out)}
