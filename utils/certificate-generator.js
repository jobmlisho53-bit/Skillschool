const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// Professional certificate template
async function generateCertificateImage(userName, courseName, certificateId, completedAt) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page (A4 landscape - 842 x 595 points)
    const page = pdfDoc.addPage([842, 595]);
    
    // Get fonts
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const scriptFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    
    // Draw decorative border (gold)
    page.drawRectangle({
        x: 30,
        y: 30,
        width: 782,
        height: 535,
        borderColor: rgb(0.83, 0.69, 0.22), // Gold #d4af37
        borderWidth: 3,
    });
    
    // Draw inner border
    page.drawRectangle({
        x: 40,
        y: 40,
        width: 762,
        height: 515,
        borderColor: rgb(0.83, 0.69, 0.22),
        borderWidth: 1,
    });
    
    // Draw gold accent lines
    page.drawLine({
        start: { x: 50, y: 80 },
        end: { x: 792, y: 80 },
        thickness: 1,
        color: rgb(0.83, 0.69, 0.22),
    });
    
    page.drawLine({
        start: { x: 50, y: 515 },
        end: { x: 792, y: 515 },
        thickness: 1,
        color: rgb(0.83, 0.69, 0.22),
    });
    
    // Header: "CERTIFICATE OF COMPLETION"
    page.drawText('CERTIFICATE OF COMPLETION', {
        x: 421 - (titleFont.widthOfTextAtSize('CERTIFICATE OF COMPLETION', 28) / 2),
        y: 480,
        size: 28,
        font: titleFont,
        color: rgb(0.83, 0.69, 0.22),
    });
    
    // Subheader
    page.drawText('This certificate is proudly presented to', {
        x: 421 - (bodyFont.widthOfTextAtSize('This certificate is proudly presented to', 14) / 2),
        y: 420,
        size: 14,
        font: bodyFont,
        color: rgb(0.2, 0.2, 0.2),
    });
    
    // User Name (large, elegant)
    const userNameDisplay = userName || 'Valued Learner';
    page.drawText(userNameDisplay, {
        x: 421 - (scriptFont.widthOfTextAtSize(userNameDisplay, 32) / 2),
        y: 360,
        size: 32,
        font: scriptFont,
        color: rgb(0.1, 0.1, 0.1),
    });
    
    // For completing
    page.drawText('for successfully completing the course', {
        x: 421 - (bodyFont.widthOfTextAtSize('for successfully completing the course', 12) / 2),
        y: 310,
        size: 12,
        font: bodyFont,
        color: rgb(0.3, 0.3, 0.3),
    });
    
    // Course Name
    page.drawText(courseName, {
        x: 421 - (titleFont.widthOfTextAtSize(courseName, 18) / 2),
        y: 275,
        size: 18,
        font: titleFont,
        color: rgb(0.83, 0.69, 0.22),
    });
    
    // Completion date
    const dateStr = `Completed on: ${new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    page.drawText(dateStr, {
        x: 421 - (bodyFont.widthOfTextAtSize(dateStr, 10) / 2),
        y: 220,
        size: 10,
        font: bodyFont,
        color: rgb(0.4, 0.4, 0.4),
    });
    
    // Certificate ID
    page.drawText(`Certificate ID: ${certificateId}`, {
        x: 50,
        y: 100,
        size: 8,
        font: bodyFont,
        color: rgb(0.5, 0.5, 0.5),
    });
    
    // Verification text
    page.drawText('Verify at: https://skillschool-dbc1.vercel.app/verify', {
        x: 50,
        y: 85,
        size: 8,
        font: bodyFont,
        color: rgb(0.5, 0.5, 0.5),
    });
    
    // Signature line
    page.drawLine({
        start: { x: 550, y: 150 },
        end: { x: 750, y: 150 },
        thickness: 1,
        color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText('Authorized Signature', {
        x: 620,
        y: 135,
        size: 8,
        font: bodyFont,
        color: rgb(0.5, 0.5, 0.5),
    });
    
    // Gold seal/stamp (circle)
    page.drawEllipse({
        x: 100,
        y: 150,
        xScale: 35,
        yScale: 35,
        borderColor: rgb(0.83, 0.69, 0.22),
        borderWidth: 2,
    });
    
    page.drawText('SKILL', {
        x: 85,
        y: 152,
        size: 10,
        font: titleFont,
        color: rgb(0.83, 0.69, 0.22),
    });
    page.drawText('TO', {
        x: 95,
        y: 142,
        size: 10,
        font: titleFont,
        color: rgb(0.83, 0.69, 0.22),
    });
    page.drawText('INCOME', {
        x: 82,
        y: 132,
        size: 9,
        font: titleFont,
        color: rgb(0.83, 0.69, 0.22),
    });
    
    // Legal disclaimer
    const disclaimer = "This certificate acknowledges completion of a non-accredited course. It is not a professional certification or guarantee of employment.";
    page.drawText(disclaimer, {
        x: 421 - (bodyFont.widthOfTextAtSize(disclaimer, 6) / 2),
        y: 60,
        size: 6,
        font: bodyFont,
        color: rgb(0.6, 0.6, 0.6),
    });
    
    // Serialize PDF to bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

// Generate and save certificate to file
async function saveCertificate(userName, courseName, certificateId, completedAt, outputPath) {
    const pdfBytes = await generateCertificateImage(userName, courseName, certificateId, completedAt);
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
}

module.exports = { generateCertificateImage, saveCertificate };
