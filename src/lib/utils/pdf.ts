import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import type { Order, Settings, Customer } from '$types/laundry';
import { formatRupiah, formatDate, formatDateTime } from './formatters';

export function generateOrderPDF(order: Order, customer?: Customer, settings?: Settings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 160] // Thermal receipt format (80mm width)
  });

  const laundryName = settings?.nama_laundry || 'SVRA Laundry';
  const laundryAddress = settings?.alamat || 'Jl. Merdeka No. 123, Jakarta';
  const laundryPhone = settings?.telepon || '0812-3456-7890';
  const footerText = settings?.footer || 'Terima kasih telah menggunakan layanan kami.';

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235); // Blue #2563EB
  doc.text(laundryName, 40, 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(laundryAddress, 40, 14, { align: 'center' });
  doc.text(`Telp: ${laundryPhone}`, 40, 17, { align: 'center' });

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(5, 20, 75, 20);

  // Invoice Meta
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(`NOTA: ${order.invoice}`, 5, 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Tgl Masuk  : ${formatDate(order.tanggal, 'DD/MM/YYYY')}`, 5, 29);
  doc.text(`Est Selesai: ${formatDate(order.estimasi, 'DD/MM/YYYY')}`, 5, 33);
  doc.text(`Pelanggan  : ${order.customer_nama || customer?.nama || 'Umum'}`, 5, 37);
  doc.text(`No HP      : ${order.customer_hp || customer?.hp || '-'}`, 5, 41);
  doc.text(`Status     : ${order.status}`, 5, 45);

  // Table header & content
  autoTable(doc, {
    startY: 48,
    margin: { left: 5, right: 5 },
    head: [['Layanan', 'Kg', 'Harga', 'Subtotal']],
    body: [
      [
        order.service_nama || 'Cuci Komplit',
        `${order.berat} kg`,
        formatRupiah(order.harga),
        formatRupiah(order.subtotal)
      ]
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [50, 50, 50]
    },
    styles: {
      cellPadding: 1.5
    }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 65;

  // Calculation section
  doc.setDrawColor(220, 220, 220);
  doc.line(5, finalY + 2, 75, finalY + 2);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 45, finalY + 7);
  doc.text(formatRupiah(order.subtotal), 75, finalY + 7, { align: 'right' });

  if (order.diskon > 0) {
    doc.text('Diskon:', 45, finalY + 11);
    doc.text(`-${formatRupiah(order.diskon)}`, 75, finalY + 11, { align: 'right' });
    finalY += 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text('TOTAL:', 45, finalY + 12);
  doc.text(formatRupiah(order.total), 75, finalY + 12, { align: 'right' });

  if (order.catatan) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Catatan: ${order.catatan}`, 5, finalY + 17);
    finalY += 5;
  }

  // Footer & QR Code Placeholder graphic
  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(5, finalY + 20, 75, finalY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text(footerText, 40, finalY + 25, { align: 'center' });
  doc.text(`Dicetak: ${formatDateTime(new Date())}`, 40, finalY + 28, { align: 'center' });

  // Save / Trigger Download
  doc.save(`${order.invoice}.pdf`);
}

export function exportOrdersPDF(orders: Order[], title: string = 'Laporan Cucian') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(title, 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Dicetak pada: ${formatDateTime(new Date())}`, 14, 21);

  const tableRows = orders.map((ord) => [
    ord.invoice,
    ord.customer_nama || '-',
    formatDate(ord.tanggal),
    ord.service_nama || '-',
    `${ord.berat} kg`,
    formatRupiah(ord.total),
    ord.status,
    formatDate(ord.estimasi)
  ]);

  autoTable(doc, {
    startY: 26,
    head: [['No. Nota', 'Pelanggan', 'Tanggal', 'Layanan', 'Berat', 'Total', 'Status', 'Est. Selesai']],
    body: tableRows,
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`Laporan_Laundry_${dayjs().format('YYYYMMDD_HHmm')}.pdf`);
}
