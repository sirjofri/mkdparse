/*

     mkdparse (mkd.js) - a wannabe markdown parser

     Author: sirjofri
     Version: 0.1
     https://github.com/sirjofri/mkdparse

You are free to use this software for whatever you want, but please look at the following points.

- You are **allowed** to send me a gift if you like.
- You are **allowed** to send the whole package to someone else, unchanged and as it is.
- You are **allowed** to extract the `mkd.js` file, as long as you provide this license information somewhere.
- You are **allowed** to use portions of the code for whatever you like.
- You are **not allowed** to receive money for this software package alone. You need to at least change something.
- In case you change something: Leave the license information in the header of the file and change the "Author" to "Original Author".
- If you do that with some bigger portions (not one- or two-liners) please leave a note with a link (a comment in the code is enough)
- The software is not heavily tested. Please do not use it under weird circumstances (like: hanging on the international space station searching for the key you lost)
- Don't complain if this software kills your cat, dog or cow!
- You are allowed to contribute (if you really want. I mean, this software is more ore less abandoned...).

*/

var mkd = function(input, output) {
	this.input = input;
	this.output = output;
};

mkd.prototype.draw = function() {
	var content = this.input.innerHTML;

	var result = this.parseHeadings(content);
	result = this.parseParagraphs(result);
	result = this.parseListings(result);
	result = this.parseQuotes(result);
	result = this.parseHighlights(result);

	console.log(result);

	this.output.innerHTML = result;
};

mkd.prototype.parseHeadings = function(string) {
	var h1pattern = /^#[\s]*(.*)\n/gm;
	var h2pattern = /^##[\s]*(.*)\n/gm;

	var result = string.replace(h2pattern, "<h2>$1</h2><p>");
	var result = result.replace(h1pattern, "<h1>$1</h1><p>");

	return result;
};

mkd.prototype.parseParagraphs = function(string) {
	var parpattern = /\n{2,}/gm;
	var parpattern2 = /\n*$/g;
	var parremoveempty = /<p><\/p>/gm;
	var parremoveending = /<p>\n*(?=<h\d>)/gm;
	var parremoveending2 = /<\/p>\n*$/g;

	var result = string.replace(parpattern, "</p><p>");
	result = result.replace(parpattern2, "</p>");
	result = result.replace(parremoveempty, "");
	result = result.replace(parremoveending, "");
	result = result.replace(parremoveending2, "");

	return result;
};

mkd.prototype.parseListings = function(string) {
	var listulpattern = /<p>\* /gm;
	var listulpattern2 = /^\* ([\w\s\d]+)<\/p>/gm;
	var listlipattern = /(?:(<ul>)|\n)\* (.+)(<\/ul>|(?!$\* ))/gm;
	var listlilast = /(<\/ul>)/gm;
	var listliremoveoutside = /((?!<ul>).*)<\/li>(.*(?!<\/ul>))/gm;
	var listliremovedouble = /(<\/?li>)\1/gm;

	var result = string.replace(listulpattern, "<ul>* ");
	result = result.replace(listulpattern2, "* $1</ul>");
	result = result.replace(listlipattern, "$1<li>$2</li>");
	result = result.replace(listliremoveoutside, "$1$2");
	result = result.replace(listlilast, "</li>$1");
	result = result.replace(listliremovedouble, "$1");

	return result;
};

mkd.prototype.parseQuotes = function(string) {
	var qtbqpattern = /<p>&gt; /gm;
	var qtbqpattern2 = /^&gt; ([\w\s\d]+)<\/p>/gm;
	var qtnl = /^&gt; /gm;

	var result = string.replace(qtbqpattern, "<blockquote>");
	result = result.replace(qtbqpattern2, "&gt; $1</blockquote>");
	result = result.replace(qtnl, "<br>");

	return result;
};

mkd.prototype.parseHighlights = function(string) {
	var hlbold = /\*\*(.+)\*\*/gm;
	var hlitalic = /\*(.+)\*/gm;

	var result = string.replace(hlbold, "<b>$1</b>");
	result = result.replace(hlitalic, "<i>$1</i>");

	return result;
};
