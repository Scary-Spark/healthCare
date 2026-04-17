import PDFDocument from "pdfkit";

/**
 * Generate a stunning, modern appointment PDF
 * @param {Object} record - Appointment record from database
 * @returns {Buffer} - PDF buffer
 */
export function generateAppointmentPDF(record) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Modern Color Palette
      const COLORS = {
        primary: "#0d7377",
        primaryLight: "#14919b",
        accent: "#2dd4bf",
        dark: "#0f172a",
        text: "#334155",
        textLight: "#64748b",
        border: "#e2e8f0",
        cardBg: "#f8fafc",
        white: "#ffffff",
        // Status colors
        pending: { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
        confirmed: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
        completed: { bg: "#a7f3d0", text: "#064e3b", border: "#059669" },
        cancelled: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
        noshow: { bg: "#ffedd5", text: "#9a3412", border: "#f97316" },
        rescheduled: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" },
      };

      // Helper: Draw rounded rectangle
      function roundedRect(
        x,
        y,
        width,
        height,
        radius,
        fill = null,
        stroke = null,
      ) {
        doc.save();
        if (fill) {
          doc.fillColor(fill).roundedRect(x, y, width, height, radius).fill();
        }
        if (stroke) {
          doc
            .strokeColor(stroke)
            .lineWidth(2)
            .roundedRect(x, y, width, height, radius)
            .stroke();
        }
        doc.restore();
      }

      // Helper: Draw header gradient bar
      function drawHeader() {
        // Gradient header background
        const gradient = doc.linearGradient(50, 0, 550, 120);
        gradient.stop(0, COLORS.primary);
        gradient.stop(1, COLORS.primaryLight);

        roundedRect(0, 0, 595, 130, 0, gradient);

        // NovaLife branding
        doc.fillColor(COLORS.white).fontSize(32).font("Helvetica-Bold");
        doc.text("NovaLife", 70, 35);

        doc.fontSize(13).font("Helvetica");
        doc.text("Patient Portal", 70, 70);

        // Decorative circle
        doc.fillColor(COLORS.accent).opacity(0.3);
        doc.circle(520, 65, 40).fill();
        doc.opacity(1);

        // Document title
        doc.fillColor(COLORS.white).fontSize(16).font("Helvetica-Bold");
        doc.text("Appointment & Visit Record", 70, 95);

        // Visit ID badge
        if (record.visit_id) {
          roundedRect(380, 92, 160, 28, 14, COLORS.white, null);
          doc.fillColor(COLORS.primary).fontSize(10).font("Helvetica-Bold");
          doc.text(`Visit ID: ${record.visit_id}`, 390, 99, {
            width: 140,
            align: "center",
          });
        }

        doc.moveDown(9);
      }

      // Helper: Draw section card
      function drawSectionCard(title, icon, contentFn) {
        doc.moveDown(0.5);

        // Card background
        roundedRect(50, doc.y, 500, 40, 8, COLORS.cardBg, null);

        // Icon + Title
        doc.fillColor(COLORS.primary).fontSize(14).font("Helvetica-Bold");
        doc.text(`${icon}  ${title}`, 70, doc.y + 12, { width: 460 });

        doc.moveDown(2.2);

        // Content
        contentFn();

        doc.moveDown(0.8);
      }

      // Helper: Draw info row
      function drawInfoRow(label, value, options = {}) {
        const { bold = false, color = COLORS.text, icon = null } = options;

        doc.fillColor(COLORS.textLight).fontSize(9).font("Helvetica");
        const labelX = 70;
        const labelY = doc.y;

        if (icon) {
          doc.text(`${icon} ${label}`, labelX, labelY, { width: 140 });
        } else {
          doc.text(label, labelX, labelY, { width: 140 });
        }

        doc
          .fillColor(color)
          .fontSize(10)
          .font(bold ? "Helvetica-Bold" : "Helvetica");
        doc.text(value || "N/A", 230, labelY, { width: 310 });

        doc.moveDown(0.9);
      }

      // Helper: Draw status badge
      function drawStatusBadge(status) {
        if (!status) return;

        const statusKey = status.toLowerCase().replace(/\s+/g, "");
        const config = COLORS[statusKey] || COLORS.pending;

        const badgeText = status.toUpperCase();
        doc.fontSize(9).font("Helvetica-Bold");
        const textWidth = doc.widthOfString(badgeText);
        const padding = 10;
        const badgeWidth = textWidth + padding * 2;
        const badgeHeight = 24;

        // Badge with border
        roundedRect(
          230,
          doc.y,
          badgeWidth,
          badgeHeight,
          12,
          config.bg,
          config.border,
        );

        // Badge text
        doc.fillColor(config.text).fontSize(9).font("Helvetica-Bold");
        doc.text(badgeText, 230 + padding, doc.y + 7, { width: textWidth });

        doc.moveDown(1.5);
      }

      // ===== BUILD PDF =====

      // Header
      drawHeader();

      // Patient Information Card
      drawSectionCard("Patient Information", "👤", () => {
        drawInfoRow("Patient Name", record.patient_full_name, {
          bold: true,
          icon: "👤",
        });
        drawInfoRow("Gender", record.patient_gender, { icon: "⚥" });
        drawInfoRow("Contact", record.patient_phone, { icon: "📞" });

        if (record.other_first_name) {
          doc.moveDown(0.3);
          drawInfoRow("Booking For", "Other Patient", {
            bold: true,
            color: COLORS.primary,
            icon: "👥",
          });
          drawInfoRow(
            "Patient Name",
            `${record.other_first_name} ${record.other_last_name}`,
            { bold: true, icon: "👤" },
          );
          drawInfoRow("Contact", record.other_contact, { icon: "📞" });
          drawInfoRow("Email", record.other_email, { icon: "✉" });
          if (record.other_address) {
            drawInfoRow("Address", record.other_address, { icon: "📍" });
          }
        } else {
          drawInfoRow("Booking For", "Self (Patient)", {
            bold: true,
            color: COLORS.accent,
            icon: "✓",
          });
        }
      });

      // Appointment Details Card
      drawSectionCard("Appointment Details", "📅", () => {
        const formattedDate = record.appointment_date
          ? new Date(record.appointment_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A";

        drawInfoRow("Date", formattedDate, { bold: true, icon: "📅" });

        if (record.check_in_time) {
          const checkIn = new Date(record.check_in_time).toLocaleString(
            "en-US",
            {
              dateStyle: "medium",
              timeStyle: "short",
            },
          );
          drawInfoRow("Check-In", checkIn, { icon: "⏰" });
        }

        if (record.check_out_time) {
          const checkOut = new Date(record.check_out_time).toLocaleString(
            "en-US",
            {
              dateStyle: "medium",
              timeStyle: "short",
            },
          );
          drawInfoRow("Check-Out", checkOut, { icon: "🏁" });
        }

        if (record.appointment_status) {
          doc.moveDown(0.3);
          drawInfoRow("Status", "", { icon: "🏷" });
          drawStatusBadge(record.appointment_status);
        }
      });

      // Medical Team Card
      drawSectionCard("Medical Team", "👨‍⚕️", () => {
        drawInfoRow("Doctor", record.doctor_name || "N/A", {
          bold: true,
          icon: "👨‍⚕️",
        });
        drawInfoRow("Department", record.department_name || "N/A", {
          icon: "🏥",
        });
      });

      // Diagnosis & Notes Card
      drawSectionCard("Diagnosis & Notes", "📝", () => {
        if (record.diagnosis_name || record.notes) {
          if (record.diagnosis_name) {
            doc.fillColor(COLORS.primary).fontSize(10).font("Helvetica-Bold");
            doc.text("Diagnosis", 70, doc.y);
            doc.moveDown(0.5);

            // Diagnosis box
            roundedRect(70, doc.y, 460, 50, 6, COLORS.cardBg, null);
            doc.fillColor(COLORS.text).fontSize(9).font("Helvetica");
            doc.text(record.diagnosis_name, 80, doc.y + 10, {
              width: 440,
              lineGap: 4,
            });
            doc.moveDown(3.5);
          }

          if (record.notes) {
            doc.fillColor(COLORS.primary).fontSize(10).font("Helvetica-Bold");
            doc.text("Clinical Notes", 70, doc.y);
            doc.moveDown(0.5);

            // Notes box
            roundedRect(70, doc.y, 460, 50, 6, COLORS.cardBg, null);
            doc.fillColor(COLORS.text).fontSize(9).font("Helvetica");
            doc.text(record.notes, 80, doc.y + 10, { width: 440, lineGap: 4 });
            doc.moveDown(3.5);
          }
        } else {
          roundedRect(70, doc.y, 460, 40, 6, COLORS.cardBg, null);
          doc.fillColor(COLORS.textLight).fontSize(9).font("Helvetica-Oblique");
          doc.text(
            "No diagnosis or clinical notes recorded for this visit.",
            80,
            doc.y + 12,
            { width: 440 },
          );
          doc.moveDown(2.8);
        }
      });

      // Footer
      doc.moveDown(1);

      // Footer card
      roundedRect(50, doc.y, 500, 70, 8, COLORS.dark, null);

      const now = new Date().toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });

      // Footer content
      doc.fillColor(COLORS.white).fontSize(11).font("Helvetica-Bold");
      doc.text("NovaLife Patient Portal", 70, doc.y + 15);

      doc.fillColor(COLORS.accent).fontSize(8).font("Helvetica");
      doc.text("Generated securely and confidentially", 70, doc.y + 32);

      doc.fillColor(COLORS.textLight).fontSize(8).font("Helvetica");
      doc.text(`Generated: ${now}`, 70, doc.y + 45);
      doc.text(`Appointment ID: ${record.appointment_id}`, 70, doc.y + 56);

      // Page number
      const pages = doc.bufferedPageRange();
      doc.fillColor(COLORS.textLight);
      doc.text(`Page 1 of ${pages.count}`, 530, doc.y + 56, { align: "right" });

      // Decorative element
      doc.fillColor(COLORS.accent).opacity(0.2);
      doc.circle(500, doc.y + 35, 25).fill();
      doc.opacity(1);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
