import React from 'react'
import { PDFDownloadLink, PDFViewer, Document, Page, Text } from '@react-pdf/renderer';

const GeneratePDF = () => {
    return (
        <Document>
            <Page>
                <Text>Field 1</Text>
                <Text>Field 2</Text>
                {/* Add more fields as needed */}
            </Page>
        </Document>
    )
}

export default GeneratePDF
