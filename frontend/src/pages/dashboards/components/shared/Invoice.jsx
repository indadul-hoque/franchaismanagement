import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for modern and professional look
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'Helvetica', 
    fontSize: 12, 
    backgroundColor: '#f8f9fa' 
  },
  headerContainer: { 
    textAlign: 'center', 
    marginBottom: 20 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    marginBottom: 5,
    color: '#333'  
  },
  subHeader: { 
    fontSize: 14,  
    color: '#555', 
    marginBottom: 20
  },
  section: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 5, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 5, 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    marginBottom: 5
  },
  label: { 
    fontWeight: 'bold', 
    fontSize: 13,
    color: '#333'  
  },
  value: { 
    fontSize: 13,
    color: '#555'  
  },
  separator: {
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    marginVertical: 15
  },
  totalAmount: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'right',
    color: '#000' 
  },
  footer: { 
    textAlign: 'center', 
    fontSize: 10, 
    marginTop: 20, 
    color: '#777'
  },
  invoiceContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    padding: 20,
    borderRadius: 8,
    marginTop: 10
  }
});


const Invoice = ({ transaction }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.invoiceContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Official Fee Receipt</Text>
          <Text style={styles.subHeader}>Thank you for your payment</Text>
        </View>

        {/* Receipt Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt No:</Text>
            <Text style={styles.value}>{transaction.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(transaction.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{transaction.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{transaction.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purpose:</Text>
            <Text style={styles.value}>{transaction.purpose}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.totalAmount}>Amount Paid: ₹{transaction.amount}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>This is a computer-generated receipt and does not require a signature.</Text>
      </View>
    </Page>
  </Document>
);

export default Invoice;
