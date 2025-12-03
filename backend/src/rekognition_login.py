import json
import os
import boto3
import base64
from botocore.exceptions import ClientError
import uuid
import datetime

s3 = boto3.client('s3')
rek = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')

UPLOADS_BUCKET = os.environ['S3_BUCKET_UPLOADS']
USERS_TABLE = os.environ['USERS_TABLE']

SIMILARITY_THRESHOLD = 90.0

def lambda_handler(event, context):
    body = json.loads(event.get('body','{}'))
    user_id = body.get('userId')
    image_b64 = body.get('image_base64')
    if not user_id or not image_b64:
        return {"statusCode":400, "body": json.dumps({"error":"userId and image_base64 required"})}

    # get reference image key from DynamoDB
    table = dynamodb.Table(USERS_TABLE)
    res = table.get_item(Key={"userId": user_id})
    if 'Item' not in res:
        return {"statusCode":404,"body": json.dumps({"error":"user not found"})}
    ref_key = res['Item'].get('refImageKey')
    if not ref_key:
        return {"statusCode":400,"body": json.dumps({"error":"no reference image stored for user"})}

    # save attempt image to S3
    attempt_key = f"attempts/{user_id}/{uuid.uuid4().hex}.jpg"
    image_bytes = base64.b64decode(image_b64)
    s3.put_object(Bucket=UPLOADS_BUCKET, Key=attempt_key, Body=image_bytes, ContentType='image/jpeg')

    # call rekognition.compare_faces
    try:
        response = rek.compare_faces(
            SourceImage={'S3Object': {'Bucket': UPLOADS_BUCKET, 'Name': ref_key}},
            TargetImage={'S3Object': {'Bucket': UPLOADS_BUCKET, 'Name': attempt_key}},
            SimilarityThreshold=0  # we'll inspect similarity values ourselves
        )
    except ClientError as e:
        return {"statusCode":500, "body": json.dumps({"error":"rekognition failed", "details": str(e)})}

    matches = response.get('FaceMatches', [])
    if not matches:
        # mismatch -> call Bedrock for safe error (see interview.py for bedrock helper)
        return {"statusCode":401, "body": json.dumps({"success":False, "message":"Face not recognized"})}

    top_similarity = max([m['Similarity'] for m in matches])
    success = top_similarity >= SIMILARITY_THRESHOLD
    result = {
        "success": success,
        "similarity": top_similarity
    }
    if success:
        # create simple session token (for demo only)
        token = uuid.uuid4().hex
        # store session if you want in DynamoDB (skipped for brevity)
        result['token'] = token
        return {"statusCode":200, "body": json.dumps(result)}
    else:
        return {"statusCode":401, "body": json.dumps(result)}
