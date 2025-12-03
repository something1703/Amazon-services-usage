import boto3
import os
import json

bedrock = boto3.client('bedrock')  # ensure your AWS SDK supports bedrock

def invoke_bedrock(prompt, model='amazon.titan', max_tokens=1024):
    # Replace with actual call signature for your account/SDK
    response = bedrock.invoke_model(
        modelIdentifier=model,
        contentType='application/json',
        accept='application/json',
        body=json.dumps({"input": prompt})
    )
    # response['body'] may be a stream or bytes depending on SDK - adapt as needed
    body = response['body'].read().decode('utf-8') if hasattr(response['body'], 'read') else response['body']
    return body
