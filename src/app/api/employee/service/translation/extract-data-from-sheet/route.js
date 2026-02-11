import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import getUserFromToken from "@/app/database/lib/auth";
import { ADMIN } from "@/app/database/constants/role.js";

// Set up multer for file upload handling
const upload = multer({
  dest: "./public/uploads", // Temporary upload directory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for file uploads
  },
};

export async function POST(request) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === "No token found" ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      {
        message: `Access denied. Only '${ADMIN}' can extract the data from Sheets.`,
      },
      { status: 403 },
    );
  }

  return new Promise((resolve) => {
    upload.single("file")(request, {}, async (err) => {
      if (err) {
        return resolve(
          NextResponse.json(
            { message: "File upload failed", error: err.message },
            { status: 500 },
          ),
        );
      }

      try {
        const formData = await request.formData();
        const sheetName = formData.get("sheetName");
        const columnName = formData.get("columnName");
        const file = formData.get("file");

        if (!sheetName || !columnName || !file) {
          return resolve(
            NextResponse.json(
              { message: "Sheet name, column name, and file are required" },
              { status: 400 },
            ),
          );
        }

        // Ensure the upload directory exists if not then I will create
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Saving file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);

        await fs.promises.writeFile(filePath, buffer);

        // Initialize ExcelJS workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
          await fs.promises.unlink(filePath); // deleting file
          return resolve(
            NextResponse.json({ message: "Sheet not found" }, { status: 404 }),
          );
        }

        // Find the column index based on the column name (header row)
        const headerRow = worksheet.getRow(1);
        let columnIndex = null;

        // Log headers to debug
        // console.log("Headers in first row:", headerRow.values);

        // Find the column by name (case-insensitive, trim spaces)
        headerRow.eachCell((cell, colNumber) => {
          if (
            cell.value &&
            cell.value.toString().trim().toLowerCase() ===
              columnName.trim().toLowerCase()
          ) {
            columnIndex = colNumber; // Found column index
          }
        });

        if (!columnIndex) {
          await fs.promises.unlink(filePath); // deleting file
          return resolve(
            NextResponse.json({ message: "Column not found" }, { status: 404 }),
          );
        }

        // Get column header value
        const header = headerRow.getCell(columnIndex).value;

        // Extract column data (excluding header row)
        const data = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const cellValue = row.getCell(columnIndex).value;
            data.push(cellValue ?? null);
          }
        });

        await fs.promises.unlink(filePath); // Clean up the uploaded file

        return resolve(
          NextResponse.json({
            sheetName,
            header,
            data,
          }),
        );
      } catch (error) {
        console.error("Processing error:", error);
        return resolve(
          NextResponse.json(
            { message: "Error processing file", error: error.message },
            { status: 500 },
          ),
        );
      }
    });
  });
}

export async function GET() {
  return NextResponse.json(
    { message: "Only POST type request is allowed" },
    { status: 405 },
  );
}
