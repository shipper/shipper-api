var schema;

schema = {
  $schema: "http://json-schema.org/draft-03/schema",
  id: "http://api.shipper.co.nz/database-schema.json",
  required: false,
  type: "object",
  definitions: {
    Agent: {
      id: "User",
      type: "object",
      properties: {
        Name: {
          type: "string"
        },
        Type: {
          type: {
            "enum": ["Developer", "Internal", "Supplier", "Facility", "Consumer"]
          }
        },
        Role: {
          type: {
            "enum": ["Admin", "Standard", "Limited"]
          }
        },
        Trial: {
          type: "boolean"
        },
        Facilities: {
          type: "array",
          items: {
            $ref: "#/definitions/Facility"
          }
        }
      },
      required: ["Name", "Role", "Facilities"]
    },
    ISO3166_1: {
      id: "ISO3166_1",
      type: "object",
      properties: {
        Alpha2: {
          type: "string"
        },
        Alpha3: {
          type: "string"
        },
        Numeric: {
          type: "number"
        },
        CountryName: {
          type: "string"
        },
        ShortName: {
          type: "string"
        },
        FullName: {
          type: "string"
        },
        Remarks: {
          type: "string"
        },
        Independent: {
          type: "string"
        }
      }
    },
    ISO3166_2: {
      id: "ISO3166_2",
      type: "object",
      properties: {
        Code: {
          type: "string"
        },
        SubdivisionName: {
          type: "string"
        },
        SubdivisionCategory: {
          type: "string"
        },
        LanguageCode: {
          type: "string"
        },
        RomanizationSystem: {
          type: "string"
        },
        ParentSubdivsion: {
          type: "string"
        }
      }
    },
    Country: {
      id: "Country",
      type: "object",
      properties: {
        Name: {
          type: "string"
        },
        ISO3166_1: {
          type: {
            $ref: "#/definitions/ISO3166_1"
          }
        }
      }
    },
    Address: {
      id: "Address",
      type: "object",
      properties: {
        Number: {
          type: "number"
        },
        Unit: {
          type: "string"
        },
        Street: {
          type: "string"
        },
        Suburb: {
          type: "string"
        },
        City: {
          type: "string"
        },
        Postcode: {
          type: "string"
        },
        Region: {
          type: "string"
        },
        Country: {
          type: "string"
        },
        Additional: {
          type: "string"
        },
        ISO3166_1: {
          type: {
            $ref: "#/definitions/ISO3166_1"
          }
        },
        ISO3166_2: {
          type: {
            $ref: "#/definitions/ISO3166_2"
          }
        }
      },
      required: ["Street", "Suburb", "Postcode"]
    },
    Consumer: {
      id: "Consumer",
      type: "object",
      properties: {
        BillingAddress: {
          type: {
            $ref: "#/definitions/Address"
          }
        },
        ShippingAddress: {
          type: {
            $ref: "#/definitions/Address"
          }
        }
      }
    },
    ItemPallet: {
      id: "Pallet",
      type: "object",
      properties: {
        Measurement: {
          type: {
            $ref: "#/definitions/Measurement"
          }
        },
        ItemsPerTier: {
          type: "number"
        },
        Tiers: {
          type: "number"
        }
      }
    },
    ItemGrouping: {
      id: "Grouping",
      type: "object",
      properties: {
        Name: {
          type: "string"
        },
        Items: {
          type: "number"
        },
        Measurement: {
          type: {
            $ref: "#/definitions/Measurement"
          }
        }
      }
    },
    ItemVariationProperty: {
      id: "ItemVariationProperty",
      type: "object",
      properties: {
        PropertyName: {
          type: "string"
        },
        PropertyValue: {
          type: "any"
        }
      }
    },
    ItemVariation: {
      id: "ItemVariation",
      type: "object",
      properties: {
        StockKeepingUnit: {
          type: "string"
        },
        Description: {
          type: "string"
        },
        Variations: {
          type: "array",
          items: {
            $ref: "#/definitions/ItemVariationProperty"
          }
        },
        Item: {
          type: {
            $ref: "#/definitions/Item"
          }
        }
      }
    },
    Item: {
      id: "Item",
      type: "object",
      properties: {
        StockKeepingUnit: {
          type: "string"
        },
        UniversalProductCode: {
          type: "string"
        },
        Description: {
          type: "string"
        },
        DescriptionExtended: {
          type: "string"
        },
        LeadTime: {
          type: "number"
        },
        SafetyStock: {
          type: "number"
        },
        MinimumStock: {
          type: "number"
        },
        MaximumStock: {
          type: "number"
        },
        PurchasePrice: {
          type: "number"
        },
        SalePrice: {
          type: "number"
        },
        SKU: {
          type: "string"
        },
        Measurement: {
          type: {
            $ref: "#/definitions/Measurement"
          }
        },
        Pallet: {
          type: {
            $ref: "#/definitions/ItemPallet"
          }
        },
        Grouping: {
          type: {
            $ref: "#/definitions/ItemGrouping"
          }
        },
        Variations: {
          type: "array",
          items: {
            $ref: "#/definitions/ItemVariation"
          }
        }
      }
    },
    Measurement: {
      id: "Measurement",
      type: "object",
      properties: {
        Length: {
          type: "number"
        },
        Width: {
          type: "number"
        },
        Height: {
          type: "number"
        },
        Weight: {
          type: "number"
        },
        Imperial: {
          type: "boolean"
        }
      }
    },
    AdHocItem: {
      id: "AdHocItem",
      type: "object",
      properties: {
        Description: {
          type: "string"
        },
        PurchasePrice: {
          type: "number"
        },
        SalePrice: {
          type: "number"
        },
        SKU: {
          type: "string"
        },
        Measurement: {
          type: {
            $ref: "#/definitions/Measurement"
          }
        }
      }
    },
    Date: {
      id: "Date",
      type: "object",
      properties: {
        Time: {
          description: "Milliseconds since January 1, 1970, 00:00:00 UTC",
          type: "number"
        }
      }
    },
    SerialScan: {
      id: "SerialScan",
      type: "object",
      properties: {
        SerialNumber: {
          type: "string"
        },
        ScanDate: {
          type: "number"
        }
      }
    },
    Note: {
      id: "Note",
      type: "object",
      properties: {
        User: {
          type: {
            $ref: "#/definitions/User"
          }
        },
        Note: {
          type: "string"
        },
        LimitType: {
          type: "string"
        },
        LimitRole: {
          type: "string"
        },
        CreateDate: {
          type: "number"
        }
      }
    },
    OrderItem: {
      id: "OrderItem",
      type: "object",
      properties: {
        Item: {
          type: {
            $ref: "#/definitions/Item"
          }
        },
        AdHocItem: {
          type: {
            $ref: "#/definitions/AdHocItem"
          }
        },
        Serials: {
          type: "array",
          items: {
            $ref: "#/definitions/SerialScan"
          }
        },
        Reference: {
          type: "string"
        },
        PurchaseNumber: {
          type: "string"
        },
        Notes: {
          type: "array",
          items: {
            $ref: "#/definitions/Note"
          }
        }
      }
    },
    SendOrder: {
      id: "SendOrder",
      type: "object",
      properties: {
        Items: {
          type: "array",
          items: {
            $ref: "#/definitions/OrderItem"
          }
        },
        Address: {
          type: {
            $ref: "#/definitions/Address"
          }
        }
      }
    },
    StoreOrder: {
      id: "StoreOrder",
      type: "object",
      properties: {
        CreateDate: {
          type: "number"
        },
        Items: {
          type: "array",
          items: {
            $ref: "#/definitions/Item"
          }
        },
        ExpectedArrival: {
          type: "number"
        },
        Arrival: {
          type: "number"
        },
        TrackingNumber: {
          type: "string"
        },
        ProgressiveNumber: {
          type: "string"
        },
        TrailerNumber: {
          type: "string"
        },
        ContainerNumber: {
          type: "string"
        },
        CapacityType: {
          type: "string",
          "enum": ["20ft Container", "40ft Container", "45ft Container", "48ft Trailer", "53ft Trailer"]
        },
        SealNumber: {
          type: "string"
        },
        Notes: {
          type: "array",
          items: {
            $ref: "#/definitions/Note"
          }
        },
        Facility: {
          type: {
            $ref: "#/definitions/Facility"
          }
        },
        User: {
          type: {
            $ref: "#/definitions/User"
          }
        }
      }
    },
    Facility: {
      id: "Facility",
      type: "object",
      properties: {
        Name: {
          type: "string"
        },
        Location: "string",
        Group: {
          type: {
            $ref: "#/definitions/Group"
          }
        }
      }
    },
    Group: {
      id: "Group",
      type: "object",
      properties: {
        Name: {
          type: "string"
        }
      }
    }
  }
};

module.exports = schema;
