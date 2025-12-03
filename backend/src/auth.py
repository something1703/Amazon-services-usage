import json
import os
import boto3
import base64
import uuid
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
USERS_TABLE = os.environ['USERS_TABLE']
UPLOADS_BUCKET = os.environ['S3_BUCKET_UPLOADS']

def lambda_handler(event, context):
    # Expect body: { "userId": "user123", "image_base64": "...", "name": "Alice" }
    body = json.loads(event.get('body','{}'))
    user_id = body.get('userId') or str(uuid.uuid4())
    image_b64 = body.get('image_base64')
    name = body.get('name','')
    if not image_b64:
        return {"statusCode":400, "body": json.dumps({"error":"image_base64 required"})}

    image_bytes = base64.b64decode(image_b64)
    key = f"refs/{user_id}/ref.jpg"
    s3.put_object(Bucket=UPLOADS_BUCKET, Key=key, Body=image_bytes, ContentType='image/jpeg')
    # store user metadata in DynamoDB
    table = dynamodb.Table(USERS_TABLE)
    table.put_item(Item={
        "userId": user_id,
        "name": name,
        "refImageKey": key,
        "createdAt": datetime.utcnow().isoformat()
    })
    return {"statusCode":200, "body": json.dumps({"userId": user_id, "refImageKey": key})}
