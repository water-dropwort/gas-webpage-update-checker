function main() {
    const hashSavedSpreadsheetUrl = 'https://docs.google.com/spreadsheets/XXXXXX';
    const sheetIndex = 0;
    const cellAddress = 'A1';
    const websiteUrl = 'https://XXXX';
    const lastHash = getHashFromSheet(hashSavedSpreadsheetUrl,
                                      sheetIndex,
                                      cellAddress);
    const newHash  = getHashFromWebSite(websiteUrl);

    if(lastHash != newHash) {
        const to = 'email address';
        const subject = '[AUTO] XXXX is updated.';
        const body = 'System has detected updating the website.';
        GmailApp.sendEmail(to,
                           hashSavedSpreadsheetUrl,
                           subject,
                           body);
        setHashToSheet(newHash,
                       sheetIndex,
                       cellAddress);
    }
    else {
        // No updates detected.
    }
}

function getHashFromSheet(spreadSheetUrl, sheetIndex, cellAddress) {
    const hash = SpreadsheetApp
          .openByUrl(spreadSheetUrl)
          .getSheets()[sheetIndex]
          .getRange(cellAddress)
          .getValue();
    return hash;
}

// https://qiita.com/SogoK/items/cc0d514ffe74009e5fd5
function MD5(input) {
    const rawHash = Utilities
          .computeDigest(Utilities.DigestAlgorithm.MD5,
                         input,
                         Utilities.Charset.UTF_8);
    var txtHash = '';
    for (i = 0; i < rawHash.length; i++) {
        var hashVal = rawHash[i];
        if (hashVal < 0) {
            hashVal += 256;
        }
        if (hashVal.toString(16).length == 1) {
            txtHash += '0';
        }
        txtHash += hashVal.toString(16);
    }
    return txtHash;
}

function getHashFromWebSite(websiteUrl) {
    const content = UrlFetchApp
          .fetch(websiteUrl)
          .getContentText();
    const newHash = MD5(content);
    return newHash;
}

function setHashToSheet(newHash, spreadSheetUrl, sheetIndex, cellAddress) {
    SpreadsheetApp
        .openByUrl(spreadSheetUrl)
        .getSheets()[sheetIndex]
        .getRange(cellAddress)
        .setValue(newHash);
}
