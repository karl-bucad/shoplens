import csv
import io

from fastapi import HTTPException, UploadFile, status


REQUIRED_COLUMNS = {
    "name",
    "shop_name",
    "category",
}


async def parse_product_csv(file: UploadFile) -> list[dict[str, str]]:
    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file is empty.",
        )

    try:
        decoded_contents = contents.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file must use UTF-8 encoding.",
        ) from exc

    reader = csv.DictReader(io.StringIO(decoded_contents))

    if reader.fieldnames is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file is missing a header row.",
        )

    normalized_headers = {
        header.strip() for header in reader.fieldnames if header is not None
    }

    missing_columns = REQUIRED_COLUMNS - normalized_headers

    if missing_columns:
        missing_columns_text = ", ".join(sorted(missing_columns))

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required CSV columns: {missing_columns_text}.",
        )

    rows: list[dict[str, str]] = []

    for row in reader:
        normalized_row = {
            key.strip(): (value or "").strip()
            for key, value in row.items()
            if key is not None
        }

        rows.append(normalized_row)

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file contains no product rows.",
        )

    return rows