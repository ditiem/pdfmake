var fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
	}
};

var pdfmake = require('../js/index');
pdfmake.setFonts(fonts);

var docDefinition = {
 pageMargins: [ 50, 80, 50, 50],
 header: function(currentPage, pageCount, pageSize) {
  return [ { height: 200, image: 'fonts/sampleImage.jpg' }
         , { relativeParentPosition: { x: 50, y: 10 }
           , table: { body: [ [ 'This is just a text with "background"' ] ] } 
           , layout:
              {
                fillColor: 'blue'
              , paddingTop: ( ) => 10
              , paddingBottom: ( ) => 10
              , paddingLeft: ( ) => 20
              , paddingRight: ( ) => 20
              }
           }
         ] ;
 },
	content: [
		  'This is the thing, the header should not overflow over the text'
  , { stack: 
       [ { image: 'fonts/sampleImage.jpg', width: 400 }
       , { relativeParentPosition: { x: 150, y: 20 }
         , table: { body: [ [ 'This is just a text with "background"' ] ] } 
         , layout:
            {
              fillColor: 'blue'
            , paddingTop: ( ) => 10
            , paddingBottom: ( ) => 10
            , paddingLeft: ( ) => 20
            , paddingRight: ( ) => 20
            }
         }
       ] }
	],
	images: {
	}
};

var now = new Date();

var pdf = pdfmake.createPdf(docDefinition);
pdf.write('pdfs/img_overlap_table.pdf');

console.log(new Date() - now);
