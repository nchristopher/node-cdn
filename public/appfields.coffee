str = '''
[
{
    "attributes": {
        "type": "Application__c",
        "url": "/services/data/v27.0/sobjects/Application__c/a07b0000004c6xAAAQ"
    },
    "Mandatory__c": false,
    "LastModifiedById": "005b0000000MGa7AAG",
    "OwnerId": "005b0000000MGa7AAG",
    "LastModifiedDate": "2013-04-25T08:41:42.000+0000",
    "Application_Icon_URL__c": "http://mpyc-img.s3.amazonaws.com/appicons/icons_ST_Travel.png",
    "Default__c": false,
    "Active__c": false,
    "Application_URL__c": "http://www.travelezine.co.uk",
    "Name": "ST Travel",
    "Application_Icon_Preview__c": "_IM1_http://mpyc-img.s3.amazonaws.com/appicons/icons_ST_Travel.png_IM2_ _IM3__30_IM4_30_IM5_",
    "SystemModstamp": "2013-04-25T08:41:42.000+0000",
    "CreatedById": "005b0000000MGa7AAG",
    "CreatedDate": "2013-04-25T08:41:42.000+0000",
    "Featured_Banner_Preview__c": "No Image Uploaded",
    "IsDeleted": false,
    "Id": "_TESTMulti-a07b0000004c6xAAAQ",
    "Description__c": "The Sunday Times Travel magazine",
    "Featured__c": false
},
{
    "attributes": {
        "type": "Application__c",
        "url": "/services/data/v27.0/sobjects/Application__c/a07b0000004c6x5AAA"
    },
    "Mandatory__c": false,
    "LastModifiedById": "005b0000000MGa7AAG",
    "OwnerId": "005b0000000MGa7AAG",
    "LastModifiedDate": "2013-04-25T08:41:42.000+0000",
    "Application_Icon_URL__c": "http://mpyc-img.s3.amazonaws.com/appicons/icons_Copy_Taking.png",
    "Default__c": false,
    "Active__c": false,
    "Application_URL__c": "http://edse-web/corporate/top_copytaking.html",
    "Name": "Copy Taking",
    "Application_Icon_Preview__c": "_IM1_http://mpyc-img.s3.amazonaws.com/appicons/icons_Copy_Taking.png_IM2_ _IM3__30_IM4_30_IM5_",
    "SystemModstamp": "2013-04-25T08:41:42.000+0000",
    "CreatedById": "005b0000000MGa7AAG",
    "CreatedDate": "2013-04-25T08:41:42.000+0000",
    "Featured_Banner_Preview__c": "No Image Uploaded",
    "IsDeleted": false,
    "Id": "_TESTMulti-a07b0000004c6x5AAA",
    "Description__c": "Copytaking Arrangements",
    "Featured__c": false
},
{
    "attributes": {
        "type": "Application__c",
        "url": "/services/data/v27.0/sobjects/Application__c/a07b0000004c6x3AAA"
    },
    "Mandatory__c": false,
    "LastModifiedById": "005b0000000MGa7AAG",
    "OwnerId": "005b0000000MGa7AAG",
    "LastModifiedDate": "2013-04-25T08:41:42.000+0000",
    "Application_Icon_URL__c": "http://mpyc-img.s3.amazonaws.com/appicons/icons_Thesaurus.png",
    "Default__c": false,
    "Active__c": false,
    "Application_URL__c": "http://thesaurus.com/",
    "Name": "Thesaurus",
    "Application_Icon_Preview__c": "_IM1_http://mpyc-img.s3.amazonaws.com/appicons/icons_Thesaurus.png_IM2_ _IM3__30_IM4_30_IM5_",
    "SystemModstamp": "2013-04-25T08:41:42.000+0000",
    "CreatedById": "005b0000000MGa7AAG",
    "CreatedDate": "2013-04-25T08:41:42.000+0000",
    "Featured_Banner_Preview__c": "No Image Uploaded",
    "IsDeleted": false,
    "Id": "_TESTMulti-a07b0000004c6x3AAA",
    "Description__c": "Online thesaurus",
    "Featured__c": false
}
]
'''
app = {
    "attributes": {
        "type": "Application__c",
        "url": "/services/data/v27.0/sobjects/Application__c/a07b0000004c6x5AAA"
    },
    "Mandatory__c": false,
    "LastModifiedById": "005b0000000MGa7AAG",
    "OwnerId": "005b0000000MGa7AAG",
    "LastModifiedDate": "2013-04-25T08:41:42.000+0000",
    "Application_Icon_URL__c": "http://mpyc-img.s3.amazonaws.com/appicons/icons_Copy_Taking.png",
    "Default__c": false,
    "Active__c": false,
    "Application_URL__c": "http://edse-web/corporate/top_copytaking.html",
    "Name": "Copy Taking",
    "Application_Icon_Preview__c": "_IM1_http://mpyc-img.s3.amazonaws.com/appicons/icons_Copy_Taking.png_IM2_ _IM3__30_IM4_30_IM5_",
    "SystemModstamp": "2013-04-25T08:41:42.000+0000",
    "CreatedById": "005b0000000MGa7AAG",
    "CreatedDate": "2013-04-25T08:41:42.000+0000",
    "Featured_Banner_Preview__c": "No Image Uploaded",
    "IsDeleted": false,
    "Id": "_TESTMulti-a07b0000004c6x5AAA",
    "Description__c": "Copytaking Arrangements",
    "Featured__c": false
}

console.log "STR type: #{typeof str}"
console.log str

console.log "APP type: #{typeof app}"
console.log app

find = []
replace = []
for k,v of app
	find.push k+':'
	replace.push '"'+k+'":'
console.log "FIND:"
console.log find
console.log "REPLACE:"
console.log replace

replaceMany = (str, find, replace) ->
  for i in find
    str = str.replace(find[i], replace[i])
  return str

clean = replaceMany(str, find, replace)
console.log clean
JSON.parse(clean)
console.log()

