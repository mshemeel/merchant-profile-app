export const dummyData = {
  "users": [
    {
      "email": "merchant1@shemeel.com",
      "password": "password123",
      "merchantName": "ABC Retailers",
      "mids": [
        {
          "mid": "MID001",
          "paymentChannel": "ECOM",
          "status": "active",
          "createdDate": "2024-01-15",
          "totalTransactions": 142,
          "tids": [
            {
              "tid": "TID1001",
              "status": "active",
              "activationDate": "2024-01-20",
              "totalTransactions": 98
            },
            {
              "tid": "TID1002",
              "status": "inactive",
              "activationDate": "2024-02-05",
              "totalTransactions": 44
            }
          ]
        },
        {
          "mid": "MID002",
          "paymentChannel": "POS",
          "status": "active",
          "createdDate": "2024-02-10",
          "totalTransactions": 67,
          "tids": [
            {
              "tid": "TID2001",
              "status": "active",
              "activationDate": "2024-02-15",
              "totalTransactions": 67
            }
          ]
        },
        {
          "mid": "MID003",
          "paymentChannel": "SoftPOS",
          "status": "inactive",
          "createdDate": "2024-03-05",
          "totalTransactions": 0,
          "tids": []
        }
      ]
    }
  ],
  "transactions": [
    {
      "id": "TRANS001",
      "mid": "MID001",
      "tid": "TID1001",
      "amount": "250.00",
      "currency": "AED",
      "status": "Success",
      "timestamp": "2025-04-01T12:30:00Z",
      "paymentMethod": "Credit Card",
      "cardType": "Visa",
      "cardLast4": "4242",
      "authCode": "AUTH123",
      "additionalInfo": {
        "Terminal Location": "Main Store",
        "Customer Reference": "CUS12345",
        "Payment Type": "Contactless"
      }
    },
    {
      "id": "TRANS002",
      "mid": "MID002",
      "tid": "TID2001",
      "amount": "115.50",
      "currency": "AED",
      "status": "Failed",
      "timestamp": "2025-04-01T15:00:00Z",
      "paymentMethod": "Credit Card",
      "cardType": "Mastercard",
      "cardLast4": "5678",
      "failureReason": "Insufficient Funds",
      "additionalInfo": {
        "Terminal Location": "Branch Office",
        "Error Code": "E1001",
        "Attempts": "1"
      }
    },
    {
      "id": "TRANS003",
      "mid": "MID001",
      "tid": "TID1001",
      "amount": "320.75",
      "currency": "AED",
      "status": "Success",
      "timestamp": "2025-04-02T09:15:00Z",
      "paymentMethod": "Debit Card",
      "cardType": "Visa Debit",
      "cardLast4": "9876",
      "authCode": "AUTH456",
      "additionalInfo": {
        "Terminal Location": "Main Store",
        "Customer Reference": "CUS67890",
        "Payment Type": "Chip & PIN"
      }
    },
    {
      "id": "TRANS004",
      "mid": "MID001",
      "tid": "TID1002",
      "amount": "50.25",
      "currency": "AED",
      "status": "Success",
      "timestamp": "2025-04-02T14:45:00Z",
      "paymentMethod": "Apple Pay",
      "cardType": "Visa",
      "cardLast4": "1234",
      "authCode": "AUTH789",
      "additionalInfo": {
        "Terminal Location": "Mobile POS",
        "Device ID": "iPhone 15 Pro",
        "Payment Type": "Digital Wallet"
      }
    },
    {
      "id": "TRANS005",
      "mid": "MID002",
      "tid": "TID2001",
      "amount": "75.00",
      "currency": "AED",
      "status": "Success",
      "timestamp": "2025-04-03T10:20:00Z",
      "paymentMethod": "Google Pay",
      "cardType": "Mastercard",
      "cardLast4": "2468",
      "authCode": "AUTH321",
      "additionalInfo": {
        "Terminal Location": "Branch Office",
        "Device ID": "Pixel 7",
        "Payment Type": "Digital Wallet"
      }
    },
    {
      "id": "TRANS006",
      "mid": "MID001",
      "tid": "TID1001",
      "amount": "180.30",
      "currency": "AED",
      "status": "Success",
      "timestamp": "2025-04-03T16:55:00Z",
      "paymentMethod": "Credit Card",
      "cardType": "American Express",
      "cardLast4": "3535",
      "authCode": "AUTH654",
      "additionalInfo": {
        "Terminal Location": "Main Store",
        "Customer Reference": "CUS54321",
        "Payment Type": "Manual Entry"
      }
    },
    {
      "id": "TRANS007",
      "mid": "MID001",
      "tid": "TID1002",
      "amount": "95.40",
      "currency": "AED",
      "status": "Failed",
      "timestamp": "2025-04-04T08:30:00Z",
      "paymentMethod": "Credit Card",
      "cardType": "Visa",
      "cardLast4": "8765",
      "failureReason": "Card Expired",
      "additionalInfo": {
        "Terminal Location": "Mobile POS",
        "Error Code": "E2002",
        "Attempts": "2"
      }
    }
  ],
  "summary": {
    "totalSales": 991.80,
    "totalTransactions": 7,
    "successfulTransactions": 5,
    "failedTransactions": 2
  }
}; 