//1D4 + AD6 + (D8 * 3D12) + 12D20 + 1D100 + 1 + 10 + 100 / 1000 - 60
//1D4+D6+(D8*3D12)+12D20+1D100+1+10+100/1000-60

export class Calculator{
    constructor(stringExpression, invalidFunc)
    {
        this.fullExp = stringExpression;
        this.fullExp = this.SimplifyExpression();
        this.validExp = this.VerifyExpression();
        if(this.validExp)
        {
            let exp = this.GetNumericExpression();
            this.roll = this.MathExpression(exp.rolls);
            this.minRoll = this.MathExpression(exp.min);
            this.maxRoll = this.MathExpression(exp.max);
        }
        else{
            invalidFunc();
        }
        //console.log(this);
    }

    SimplifyExpression(){
        let newExp = this.fullExp.replace(/[^-+/*()\dD]/gi, '');        
        if (newExp.charAt(0) !== '+' && newExp.charAt(0) !== '-')
            newExp = '+' + newExp;
        return newExp;
    }

    VerifyExpression(){
        let dCount = 0, parenthes = 0;
        for (let i = 0; i < this.fullExp.length; i++) 
        {
            let c = this.fullExp.charAt(i);
            switch (c) {
                case 'd': dCount++; continue;
                case 'D': dCount++; continue;
                case '(': parenthes--; continue;        
                case ')': parenthes++; continue;
            }
        }

        const mcDice = matchCount(this.fullExp, (/\d+d\d+/gi));
        const mcOp = matchCount(this.fullExp, (/[+-/*]/g));
        const mcNumber = matchCount(this.fullExp, (/[+-/*](\(*\d|\d)+(?!(d|\d))/gi));

        //console.log(`${mcDice} + " " + ${mcOp} + " " + ${mcNumber}`);

        return mcDice === dCount && parenthes === 0 && mcOp === (mcDice + mcNumber);

        function matchCount(str, pat) {
            return ((str || '').match(pat) || []).length;
        }
    }

    GetNumericExpression(){
        const matches = this.fullExp.matchAll(/(\d+)d(\d+)/gi);

        let rollEx = this.fullExp;
        let minEx = this.fullExp;
        let maxEx = this.fullExp; 

        for (const match of matches) {
            rollEx = rollEx.replace(match[0], RollDice(match[1], match[2]));
            minEx = minEx.replace(match[0], match[1]);
            maxEx = maxEx.replace(match[0], match[1] * match[2]);
        }

        return { rolls: rollEx, min: minEx, max: maxEx };
        
        function RollDice(times, value){
            let sum = 0;
            for (let i = 0; i < times; i++)
            sum += GetRngNumber(1, value);
            return sum; 

            function GetRngNumber(min, max) {
                return Math.round(Math.random() * (max - min) + min);
            }
        }
    }

    MathExpression(mathString){
        return eval(mathString);
    }

    GetSimplyExpression(){
        return this.fullExp;
    }

    GetValues(){
        return {
            roll: this.roll,
            minRoll: this.minRoll,
            maxRoll: this.maxRoll,
        };
    }
}