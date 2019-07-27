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
 sections: [ 
  {
    header: function(currentPage, pageCount, pageSize) { return [ 'Header 1' ] ; },
    footer: [ 'Fooger 1' ],
    content: [ 'Page 1 from section 1' ]
  }
 ,{
    header: function(currentPage, pageCount, pageSize) { return [ 'Header 2!' ] ; },
    footer: [ 'Fooger 2!!!' ],
    content: [ 'This pages is generated as a new section stars' ]
  }
 ]
};

var now = new Date();

var pdf = pdfmake.createPdf(docDefinition);
pdf.write('pdfs/sections.pdf');

console.log(new Date() - now);
