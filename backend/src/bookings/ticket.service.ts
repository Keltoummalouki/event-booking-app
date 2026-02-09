import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Booking } from './entities/booking.entity';

@Injectable()
export class TicketService {
  async generateTicketPdf(booking: Booking): Promise<Buffer> {
    try {
      // --- Generate QR Code (Async) ---
      const qrCodeDataUrl = await QRCode.toDataURL(`BOOKING:${booking.id}`, {
        width: 150,
        margin: 0,
        color: { dark: '#000000', light: '#ffffff' },
      });
      const qrCodeBuffer = Buffer.from(
        qrCodeDataUrl.replace(/^data:image\/png;base64,/, ''),
        'base64',
      );

      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument({
            size: 'A5',
            margin: 0,
            info: {
              Title: `Ticket - ${booking.event.title}`,
              Author: 'Event Booking App',
            },
          });

          const chunks: Buffer[] = [];
          doc.on('data', (chunk) => chunks.push(chunk));
          doc.on('end', () => resolve(Buffer.concat(chunks)));
          doc.on('error', reject);

          // --- Styles & Constants ---
          const margin = 30;
          const width = doc.page.width - margin * 2;
          const primaryColor = '#1e3a5f';
          const accentColor = '#e74c3c';
          const secondaryColor = '#666666';
          const borderColor = '#dddddd';

          // --- Border ---
          doc
            .rect(15, 15, doc.page.width - 30, doc.page.height - 30)
            .strokeColor(primaryColor)
            .lineWidth(2)
            .stroke();

          // --- Header ---
          doc.moveDown(2);

          doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .fillColor(secondaryColor)
            .text('EVENT TICKET', margin, 40, { align: 'right' });

          doc
            .fontSize(20)
            .fillColor(primaryColor)
            .text(booking.event.title, margin, 60, {
              width: width,
              align: 'left',
            });

          // Separator
          doc
            .moveTo(margin, doc.y + 10)
            .lineTo(doc.page.width - margin, doc.y + 10)
            .strokeColor(borderColor)
            .lineWidth(1)
            .stroke();

          // --- Event Details ---
          const startY = doc.y + 25;
          const col1X = margin;

          // Date
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(secondaryColor)
            .text('DATE & TIME', col1X, startY);

          const eventDate = new Date(booking.event.date);
          const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          doc
            .fontSize(12)
            .font('Helvetica')
            .fillColor('#000')
            .text(`${formattedDate} at ${formattedTime}`, col1X, startY + 15);

          // Location
          const locationY = doc.y + 15;
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(secondaryColor)
            .text('LOCATION', col1X, locationY);

          doc
            .fontSize(12)
            .font('Helvetica')
            .fillColor('#000')
            .text(booking.event.location, col1X, locationY + 15);

          // --- Participant Details ---
          const participantY = doc.y + 15;
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(secondaryColor)
            .text('ATTENDEE', col1X, participantY);

          doc
            .fontSize(12)
            .font('Helvetica')
            .fillColor('#000')
            .text(booking.participant.email, col1X, participantY + 15);

          // --- Confirmation ID ---
          const idBoxY = doc.y + 25;

          doc
            .roundedRect(margin, idBoxY, width, 50, 5)
            .fillOpacity(0.05)
            .fill(primaryColor);

          doc.fillOpacity(1); // Reset opacity for text

          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(primaryColor)
            .text('CONFIRMATION ID', margin + 10, idBoxY + 10);

          doc
            .fontSize(14)
            .font('Courier')
            .fillColor(accentColor)
            .text(booking.id, margin + 10, idBoxY + 28);

          // --- QR Code ---
          const qrY = idBoxY + 70;
          doc.image(qrCodeBuffer, (doc.page.width - 150) / 2, qrY, {
            width: 150,
            height: 150,
          });

          // --- Footer ---
          const bottomY = doc.page.height - 30;
          doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor('#999')
            .text(
              `Generated on ${new Date().toLocaleDateString()} | Present this ticket at the event entrance.`,
              margin,
              bottomY,
              { align: 'center' },
            );

          doc.end();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
