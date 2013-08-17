#!/usr/bin/perl

use strict;

my @lines = `curl -s http://www.phrases.org.uk/meanings/phrases-and-sayings-list.html`;

open PHRASES, ">phrases.js" or die;
print PHRASES "window.tffo = window.tffo || {};\n\n";
print PHRASES "tffo.phrases = [\n";

for my $line (@lines) {
	if ($line =~ /<p class="phrase-list">.*?<a href="[^"]+">([A-Z][A-Za-z ']+)<\/a>/) {
		print PHRASES qq/  "$1",\n/;
	}
}

print PHRASES "  'A stitch in time saves nine'\n";
print PHRASES "];\n";
close PHRASES;
