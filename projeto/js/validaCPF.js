class ValidaCPF{
    constructor(cpfEnviado){
      //definindo a propriedade do cpfLimpo, que ele nao vai poder ser modificado e que também já vai ser limpo com regex
      Object.defineProperty(this, 'cpfLimpo', {
        writable:false,
        enumerable:false,
        configurable:false,
        value: cpfEnviado.replace(/\D+/g, '')
      })
    }
  
    //criando os métodos
  
    //método de checagem pra ver se o cpf não é 111.111.111-11 , ou qualquer sequencias do  tipo;
    isSequencia(){
      return this.cpfLimpo.charAt(0).repeat(this.cpfLimpo.lenght) === this.cpfLimpo //vai repetir o primeiro caracter q foi enviado do cpfLimpo(no caso o do indice 0)... vai repetir 11 vezes, que é o número de this.cpfLimpo.lenght. se isso for igual ao this.cpfLimpo, quer dizer que é uma sequencia, logo não pode ser um cpf válido
    }
  
      //gera novo cpf remover os dois digitos finais e fazer a contagem deles se estão de acordo com as normas do governo(calculo)
      geraNovoCpf(){
        //aqui se eu gerei, retorno true, se nao gerei, retorno false
        //flag pra enviar pro método principal 'valida()'
    
        const cpfSemDigitosFinais = this.cpfLimpo.slice(0,-2);// corta o cpfLimpo começando do indice 0, dai corta -2 (os dois ultimos)
        const digito1 = ValidaCPF.geraDigito(cpfSemDigitosFinais); //pega o cpf sem os dois digitos finais e manda pra um método de gerar o digito, para lá fazer a checagem se está de acordo com o calculo de cpf do governo
        const digito2 = ValidaCPF.geraDigito(cpfSemDigitosFinais + digito1);
        this.novoCPF = cpfSemDigitosFinais + digito1 + digito2;
      }
  
      //quando não uilido this no método, ele pode se tornar estático
      static geraDigito(cpfSemDigitosFinais) {//recebe o cpf sem os digitos que veio como parametro do geraDigito(cpfSemDigitosFinais) do método geraNovoCpf
              //fazendo um for pra iterar os digitos do cpf, ver que eles são em formato de string, converter pra number pra fazer as contas
        let total = 0;
        let reverso = cpfSemDigitosFinais.length + 1;//reverso pra fazer a conta com cpf do governo... começa no 10 quando tiver sem digito nenhum, começa do 11 quando tiver 1 digito
    
        for(let stringNumerica of cpfSemDigitosFinais) {//itera no for of, uma string numerica de todos numeros do cpfSemDigito
          total += reverso * Number(stringNumerica); //transforma a stringNumerica em number vai fazendo a conta com cada reverso e com cada iterada da string numerica, ai isso tudo vai ficar em uma variavel total q começou em zero e vai guardar o valor
          reverso--;//a cada iterada vai diminuindo o reverso para q seja o numero de fazer a conta do governo.. que é de 10 até 0 multiplicando com cada digito do cpf
        }
    
        const digito = 11 - (total % 11);
        return digito <= 9 ? String(digito) : '0';
      }
    
  
  
    //método principal de validação do cpf
    valida() {
      if(!this.cpfLimpo) return false;
      if(typeof this.cpfLimpo !== 'string') return false;
      if(this.cpfLimpo.length !== 11) return false;
      if(this.isSequencia()) return false;
      this.geraNovoCpf();
      //console.log(this.novoCPF);
  
      return this.novoCPF === this.cpfLimpo; //se for true , é válido
    }
  
  
  }
  
