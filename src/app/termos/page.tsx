import type { Metadata } from "next";
import Link from "next/link";
import {
  ContactLink,
  LegalPage,
  LegalSection,
} from "@/features/legal/legal-page";

export const metadata: Metadata = {
  title: "Termos de uso | Meu Visto Fácil",
  description:
    "Regras de uso do Meu Visto Fácil: o que o serviço faz, o que não faz e as responsabilidades de cada parte.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de uso"
      intro="Ao criar uma conta ou usar o Meu Visto Fácil, você concorda com estes termos. Eles explicam o que o serviço faz, o que ele não faz e as responsabilidades de cada parte."
    >
      <LegalSection title="O que é o serviço">
        <p>
          O Meu Visto Fácil é um aplicativo de teste criado por Pedro Paulo
          Daris. A ideia nasceu do Trabalho de Conclusão de Curso (TCC) dele e,
          por enquanto, o projeto não tem fins financeiros: o uso é gratuito.
        </p>
        <p>
          Ele organiza informações públicas de órgãos oficiais de imigração para
          ajudar você a entender caminhos possíveis e acompanhar as etapas de um
          processo.
        </p>
      </LegalSection>

      <LegalSection title="O que o serviço não é">
        <ul>
          <li>
            Não substitui nenhuma assessoria oficial nem o atendimento dos
            órgãos de imigração, consulados ou embaixadas.
          </li>
          <li>
            Não é aconselhamento jurídico nem substitui um advogado ou consultor
            de imigração.
          </li>
          <li>
            Não avalia elegibilidade, não garante aprovação e não tem ligação
            com nenhum governo.
          </li>
          <li>
            As compatibilidades mostradas são estimativas baseadas nas suas
            respostas e em regras simples. As decisões cabem sempre às
            autoridades oficiais.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Sempre confira nos sites oficiais">
        <p>
          Cada informação aponta para a fonte oficial de onde veio, com a data
          da consulta, mas regras de imigração mudam com frequência e o app pode
          estar desatualizado. Antes de qualquer decisão, pedido ou pagamento,
          confira os requisitos, prazos e valores diretamente nos sites oficiais
          do governo do país de destino. Se houver diferença, vale sempre o que
          diz o órgão oficial.
        </p>
      </LegalSection>

      <LegalSection title="Sua conta">
        <ul>
          <li>Você precisa ter 18 anos ou mais.</li>
          <li>
            Use um e-mail seu e mantenha a senha em segredo. Você é responsável
            pelo que for feito com a sua conta.
          </li>
          <li>
            Responda ao questionário com informações verdadeiras; respostas
            erradas geram orientações erradas.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Uso permitido">
        <p>
          Não é permitido tentar acessar dados de outras pessoas, sobrecarregar
          ou atacar o serviço, nem usá-lo para fins ilegais. Contas usadas dessa
          forma podem ser suspensas.
        </p>
      </LegalSection>

      <LegalSection title="Limitação de responsabilidade">
        <p>
          O serviço é oferecido como está, sem cobrança, durante a fase de
          testes. Fazemos o possível para manter as informações corretas e
          atualizadas, mas não respondemos por decisões tomadas apenas com base
          no Meu Visto Fácil, por indisponibilidades ou por mudanças nas regras
          oficiais.
        </p>
      </LegalSection>

      <LegalSection title="Encerramento">
        <p>
          Você pode excluir a sua conta a qualquer momento na página do{" "}
          <Link
            href="/profile"
            className="text-primary underline underline-offset-4"
          >
            perfil
          </Link>
          . Os dados são apagados como descrito na{" "}
          <Link
            href="/privacidade"
            className="text-primary underline underline-offset-4"
          >
            política de privacidade
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Mudanças e lei aplicável">
        <p>
          Estes termos podem mudar; a data no topo indica a versão em vigor.
          Eles seguem as leis brasileiras. Dúvidas: <ContactLink />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
