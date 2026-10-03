import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155", // Slate dark text
    backgroundColor: "#ffffff",
  },
  // Top Header Area
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 20,
    marginBottom: 25,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a", // Off-black
    letterSpacing: 0.5,
  },
  companySub: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  invoiceTitleBlock: {
    textAlign: "right",
  },
  invoiceTitleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  invoiceMetaId: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
  },
  // Split Metadata Grid
  metaGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 20,
  },
  metaColumn: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 3,
  },
  metaText: {
    lineHeight: 1.4,
    color: "#475569",
  },
  metaLabelInline: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  // Realistic Professional Table Setup
  tableContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a", // Premium dark header
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  // Proportional item column weight distributions
  cellProduct: { flex: 4, paddingRight: 10 },
  cellQty: { flex: 1, textAlign: "center" },
  cellPrice: { flex: 1.5, textAlign: "right" },
  cellTotal: { flex: 1.5, textAlign: "right" },

  rowTextProduct: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e293b",
  },
  rowTextMeta: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 1,
  },
  // Financial Summary Strip
  summaryBlockContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  summaryWrapper: {
    width: 200,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  summaryTotalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  summaryTotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  // Footer Signature Elements
  footerBlock: {
    marginTop: 45,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 15,
    textAlign: "center",
  },
  footerGreeting: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 3,
  },
  footerDisclaimer: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
});

const Invoice = ({ transaction }) => {
  const orderDate = transaction?.date
    ? new Date(transaction.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // Extract address securely matching parameters mapped via your PlaceOrder profile logic
  const shipping = transaction?.shippingAddress || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Brand Identity Header Row */}
        <View style={styles.brandHeader}>
          <View>
            <Text style={styles.companyName}>MARKETPLACE</Text>
            <Text style={styles.companySub}>
              Premium Materials & Operations Supply Corp.
            </Text>
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceTitleLabel}>Tax Invoice</Text>
            <Text style={styles.invoiceMetaId}>
              Invoice reference: #{transaction?.id || "UNKNOWN"}
            </Text>
          </View>
        </View>

        {/* Dynamic Context Split Meta Columns */}
        <View style={styles.metaGridRow}>
          {/* Column 1: Core Transaction Variables */}
          <View style={styles.metaColumn}>
            <Text style={styles.sectionHeading}>Order Details</Text>
            <Text style={styles.metaText}>
              <Text style={styles.metaLabelInline}>Date: </Text>
              {orderDate}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.metaLabelInline}>Payment: </Text>
              {transaction?.paymentMode || "Authorized Protocol"}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.metaLabelInline}>Status: </Text>Settled &
              Dispatched
            </Text>
          </View>

          {/* Column 2: Client Demographics Destination */}
          <View style={styles.metaColumn}>
            <Text style={styles.sectionHeading}>Delivery Destination</Text>
            <Text
              style={[
                styles.metaText,
                { fontWeight: "bold", color: "#1e293b" },
              ]}
            >
              {shipping.name || "Recipient Name"}
            </Text>
            <Text style={styles.metaText}>
              {shipping.addressLine || "Street Address missing"}
            </Text>
            <Text style={styles.metaText}>
              {shipping.city ? `${shipping.city}, ` : ""}
              {shipping.state ? `${shipping.state} ` : ""}
              {shipping.pincode ? ` - ${shipping.pincode}` : ""}
            </Text>
            {shipping.phone && (
              <Text style={styles.metaText}>Phone: {shipping.phone}</Text>
            )}
          </View>
        </View>

        {/* Product Calculation Table Matrix */}
        <View style={styles.tableContainer}>
          {/* Header Track */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.cellProduct]}>
              Item Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.cellQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.cellPrice]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.cellTotal]}>
              Amount
            </Text>
          </View>

          {/* Dynamic Map Stack Rows */}
          {(transaction?.items || []).map((item, index) => (
            <View style={styles.tableRow} key={item.id || index}>
              <View style={styles.cellProduct}>
                <Text style={styles.rowTextProduct}>
                  {item.name || "Marketplace Product"}
                </Text>
                {item.color && (
                  <Text style={styles.rowTextMeta}>Finish: {item.color}</Text>
                )}
              </View>
              <Text style={[styles.metaText, styles.cellQty]}>
                {item.quantity || 1}
              </Text>
              <Text style={[styles.metaText, styles.cellPrice]}>
                ₹
                {(item.price || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={[styles.rowTextProduct, styles.cellTotal]}>
                ₹
                {((item.price || 0) * (item.quantity || 1)).toLocaleString(
                  "en-IN",
                  { minimumFractionDigits: 2 },
                )}
              </Text>
            </View>
          ))}
        </View>

        {/* Aggregate Balance Statement Block */}
        <View style={styles.summaryBlockContainer}>
          <View style={styles.summaryWrapper}>
            <View style={styles.summaryLine}>
              <Text style={{ color: "#64748b" }}>Logistics & Freight</Text>
              <Text style={{ fontWeight: "bold", color: "#16a34a" }}>FREE</Text>
            </View>
            <View style={styles.summaryTotalLine}>
              <Text style={styles.summaryTotalLabel}>Grand Total due</Text>
              <Text style={styles.summaryTotalValue}>
                ₹
                {(transaction?.amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Official Layout Base Footer */}
        <View style={styles.footerBlock}>
          <Text style={styles.footerGreeting}>
            Thank you for your business!
          </Text>
          <Text style={styles.footerDisclaimer}>
            This document is a digitally compiled tax invoice statement. No
            physical signature parameters are required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
