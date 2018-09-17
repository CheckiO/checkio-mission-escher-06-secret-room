//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function secretRoomCanvas(dom, input) {
            const DIGIT = ['one', 'two', 'three', 'four', 'five', 
                            'six', 'seven', 'eight', 'nine'];
            const TEEN = {
                10: 'ten', 11: 'eleven', 12: 'twelve', 
                13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
                16: 'sixteen', 17: 'seventeen', 18: 'eighteen',
                19: 'nineteen'};
            const TENS = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 
                'seventy', 'eighty', 'ninety'];

            function alpha_num(n) {

                let result = [];

                if (n > 999) {
                    result.push('one thousand');
                    n -= 1000;
                }

                if (n > 99) {
                    const h = Math.floor(n / 100);
                    n %= 100;
                    result = result.concat([DIGIT[h-1], 'hundred']);
                }

                if (n) {
                    if (TEEN[n]) {
                        result.push(TEEN[n]);
                    } else {
                        if (n > 10) {
                            const t = Math.floor(n / 10);
                            n %= 10;
                            result.push(TENS[t-2]);
                        }
                        if (n)
                            result.push(DIGIT[n-1]);
                    }
                }
                return result.join(' ');
            }

            function make_secret_doors(number) {

                const a_num = [];

                for (let i=1; i <= number; i += 1)
                    a_num.push([alpha_num(i), i]);

                const sort_by_alpha = (a, b)=>{
                    if (a[0] < b[0])
                        return -1;
                    if (a[0] > b[0])
                        return 1;
                    return 0;
                };
                return a_num.sort(sort_by_alpha);
            }

            function secret_room(number, sd) {

                const tgt_a_num = alpha_num(number);

                for (let j=0; j < number; j += 1) {
                    if (sd[j][0] === tgt_a_num)
                        return j+1;
                }
            }

            const attr = {
                frame: {
                    "stroke-width": 0.5,
                },
                alpha: {
                    'font-size': '12px',
                    'font-family': 'serif',
                },
                number: {
                    'font-size': '20px',
                    'font-family': 'times',
                },
                tgt: {
                    color: {
                        "stroke-width": 0.0,
                        'fill': '#EB8224',
                    },
                    order: {
                        'font-size': '18px',
                        'font-family': 'times',
                        'stroke-with': 0,
                        'fill': '#EB8224',
                    },
                },
                other: {
                    color: {
                        "stroke-width": 0.0,
                        'fill': '#4F9FCF',
                    },
                    order: {
                        'font-size': '18px',
                        'font-family': 'times',
                        'stroke-width': 0,
                        'fill': '#4F9FCF',
                    },
                },
            };

            /*----------------------------------------------*
             *
             * secret door
             *
             *----------------------------------------------*/
            const os = 20;
            const PAPER_W = 280;
            const PAPER_H = 170;
            const paper = Raphael(dom, PAPER_W+os*2, PAPER_H+os*2, 0, 0);

            const number = input;
            const sd = make_secret_doors(number);
            const ans = secret_room(number, sd);

            for (let i=0; i < 3; i += 1) {

                let mod = 0;
                if (number > 2) {
                    if (ans===1)
                        mod = 1;
                    if (ans===number)
                        mod = -1;
                }

                if (i===0 && ans+mod-1 < 1 || i===2 && ans+mod+1 > number)
                    continue;

                // door board
                paper.rect(100*i+os, os, 90, 180).attr(
                    i+mod===1 ? attr.tgt.color: attr.other.color);
                // door frame
                paper.rect(100*i+3+os, 3+os, 84, 174).attr(attr.frame);
                // door handle
                paper.rect(100*i+78+os, 91+os, 2, 15).attr(attr.frame);

                const door_alpha = sd[ans+mod-1+(i-1)][0].split(' ');

                // door order
                paper.text(100*i+45+os, 10, '#'+(ans+mod+i-1)).attr(
                    i+mod===1 ? attr.tgt.order: attr.other.order);
                // door number
                paper.text(
                    100*i+45+os, 53, sd[ans+mod+i-2][1]).attr(attr.number);
                // door alpha 1st
                paper.text(
                    100*i+45+os, 80, door_alpha.slice(0, 2).join(' ')).attr(
                    attr.alpha);
                // door alpha 2nd
                paper.text(
                    100*i+45+os, 80+10, door_alpha.slice(2).join(' ')).attr(
                    attr.alpha);
            }
        }
        
        var $tryit;

        var io = new extIO({
            multipleArguments: false,
            functions: {
                python: 'secret_room',
                js: 'secretRoom'
            },
            animation: function($expl, data){
                secretRoomCanvas($expl[0],
                    data.in);
            }
        });
        io.start();
    }
);
