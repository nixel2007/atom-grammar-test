'use babel';

import parse from '../lib/grammar';
import { escapeSpecName } from '../lib/jasmine';


function itShouldParse(expression) {
  it(`should parse: ${escapeSpecName(expression)}`, () => {
    expect(() => parse.parse(expression)).not.toThrow();
  });
}

function itShouldNotParse(expression) {
  it(`should not parse: ${escapeSpecName(expression)}`, () => {
    expect(() => parse.parse(expression)).toThrow();
  });
}


describe('Grammar', () => {
  describe('Parsing', () => {
    itShouldParse('<- punctuation.definition.directive meta.preprocessor.c');
    itShouldParse('    ^              ^   meta.brace.curly.js');
    itShouldParse('    ^ blah.blah');
    itShouldParse('    ^^^^    Something');
    itShouldParse('<- =something');
    itShouldParse('<- only:something');

    itShouldNotParse('');
    itShouldNotParse('nothing');
    itShouldNotParse('^ ');
    itShouldNotParse('<- ');
    itShouldNotParse('<- =something else');
    itShouldNotParse('<- only:something else');

    describe('Positions', () => {
      it('should parse start line operators', () => {
        expect(parse.parse('<< something')).toEqual([
          [0],
          ['@', ['something']],
        ]);
      });

      it('should parse end line operators', () => {
        expect(parse.parse('>> something')).toEqual([
          [-1],
          ['@', ['something']],
        ]);
      });

      it('should parse open token operators', () => {
        expect(parse.parse('<- something')).toEqual([
          [1],
          ['@', ['something']],
        ]);
      });

      it('should parse carat operators', () => {
        expect(parse.parse('    ^ something')).toEqual([
          [6],
          ['@', ['something']],
        ]);
      });

      it('should parse multiple carat operators', () => {
        expect(parse.parse(' ^  ^ something')).toEqual([
          [3, 6],
          ['@', ['something']],
        ]);
      });

      it('should parse consecutive carat operators', () => {
        expect(parse.parse(' ^^^^ something')).toEqual([
          [3, 4, 5, 6],
          ['@', ['something']],
        ]);
      });
    });

    describe('Scopes', () => {
      it('should parse single part scope', () => {
        expect(parse.parse('<- something')).toEqual([
          [1],
          ['@', ['something']],
        ]);
      });

      it('should parse single part scope with a modifier', () => {
        expect(parse.parse('<- =something')).toEqual([
          [1],
          ['=', ['something']],
        ]);
      });

      it('should parse a multipart scope', () => {
        expect(parse.parse('<- something.else')).toEqual([
          [1],
          ['@', ['something.else']],
        ]);
      });

      it('should parse multiple scopes', () => {
        expect(parse.parse('<- something else')).toEqual([
          [1],
          ['@', ['something', 'else']],
        ]);
      });


      it('should parse grouped multiple scopes', () => {
        expect(parse.parse('<- (something else.other)')).toEqual([
          [1],
          ['@', ['something', 'else.other']],
        ]);
      });

      it('should parse a multipart scope with a dash', () => {
        expect(parse.parse('<- something.my-attr else')).toEqual([
          [1],
          ['@', ['something.my-attr', 'else']],
        ]);
      });

      describe('Modifiers', () => {
        it('should parse single part scope', () => {
          expect(parse.parse('<- =something')).toEqual([
            [1],
            ['=', ['something']],
          ]);
        });

        it('should parse single part scope', () => {
          expect(parse.parse('<- only:something')).toEqual([
            [1],
            ['=', ['something']],
          ]);
        });

        it('should parse grouped scope', () => {
          expect(parse.parse('<- =(something else)')).toEqual([
            [1],
            ['=', ['something', 'else']],
          ]);
        });

        it('should parse grouped scope', () => {
          expect(parse.parse('<- only:(something else)')).toEqual([
            [1],
            ['=', ['something', 'else']],
          ]);
        });

        it('should not parse ungrouped scope', () => {
          expect(() => parse.parse('<- =something else')).toThrow();
        });

        it('should not parse ungrouped scope', () => {
          expect(() => parse.parse('<- only:something else')).toThrow();
        });
      });
    });
  });
});
