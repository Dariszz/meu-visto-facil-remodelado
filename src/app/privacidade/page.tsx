import type { Metadata } from "next";
import Link from "next/link";
import {
  ContactLink,
  LegalPage,
  LegalSection,
} from "@/features/legal/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidade | Meu Visto Fácil",
  description:
    "Quais dados o Meu Visto Fácil guarda, para quê, onde ficam e como apagar.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidade"
      intro="O Meu Visto Fácil guarda o mínimo necessário para organizar o seu planejamento de imigração. Esta página explica quais dados são esses, para que servem, onde ficam e como você pode apagá-los."
    >
      <LegalSection title="Quem cuida dos seus dados">
        <p>
          O Meu Visto Fácil é um projeto independente, em fase de testes. Para
          qualquer assunto sobre os seus dados, escreva para <ContactLink />.
        </p>
      </LegalSection>

      <LegalSection title="Quais dados guardamos">
        <ul>
          <li>
            <strong>Conta:</strong> e-mail e senha. A senha é guardada pelo
            serviço de autenticação de forma cifrada; nós não temos acesso a
            ela.
          </li>
          <li>
            <strong>Perfil:</strong> nome de exibição (opcional) e idioma.
          </li>
          <li>
            <strong>Questionário:</strong> as respostas que você dá, como
            objetivo, região do passaporte, oferta de emprego, área e formação.
            Não pedimos número de documento, passaporte nem dados de saúde.
          </li>
          <li>
            <strong>Processos:</strong> o caminho que você escolheu, uma cópia
            das respostas e dos requisitos usados para montar o checklist, e o
            andamento de cada item.
          </li>
          <li>
            <strong>Dados técnicos:</strong> cookies de sessão, necessários para
            manter você conectado, e registros técnicos dos serviços de
            hospedagem e autenticação, como data e endereço IP de acesso. A
            preferência de tema claro ou escuro fica só no seu navegador.
          </li>
        </ul>
        <p>
          Não usamos ferramentas de publicidade nem de análise de comportamento,
          e não vendemos dados.
        </p>
      </LegalSection>

      <LegalSection title="Para que usamos">
        <ul>
          <li>
            Criar e proteger a sua conta e enviar e-mails de confirmação e de
            recuperação de senha.
          </li>
          <li>
            Mostrar caminhos possíveis com base nas suas respostas e montar o
            checklist do seu processo.
          </li>
          <li>Guardar o seu progresso para você continuar de onde parou.</li>
          <li>Manter o serviço funcionando e seguro.</li>
        </ul>
        <p>
          A base para esse uso é a execução do serviço que você pediu ao criar a
          conta e o nosso interesse legítimo em manter o serviço seguro, nos
          termos da Lei Geral de Proteção de Dados (LGPD).
        </p>
      </LegalSection>

      <LegalSection title="Onde os dados ficam e com quem são compartilhados">
        <p>
          Os dados são armazenados com prestadores de serviço que processam as
          informações em nosso nome:
        </p>
        <ul>
          <li>
            <strong>Supabase:</strong> banco de dados e autenticação, em
            servidores nos Estados Unidos.
          </li>
          <li>
            <strong>Google (Gmail):</strong> envio dos e-mails de confirmação e
            de recuperação de senha.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do site, quando ele estiver
            publicado.
          </li>
        </ul>
        <p>
          Como alguns desses serviços ficam fora do Brasil, os dados podem ser
          transferidos para outros países, com as proteções contratuais desses
          prestadores. Não compartilhamos dados com governos, empregadores ou
          consultorias, salvo obrigação legal.
        </p>
      </LegalSection>

      <LegalSection title="Por quanto tempo">
        <p>
          Guardamos os dados enquanto a sua conta existir. Ao excluir a conta, o
          perfil, as respostas, os processos e o acesso são apagados na hora.
          Registros técnicos dos prestadores podem permanecer pelo prazo que
          eles mantêm para segurança.
        </p>
      </LegalSection>

      <LegalSection title="Seus direitos">
        <p>
          Pela LGPD, você pode pedir confirmação e acesso aos seus dados,
          correção, portabilidade, informação sobre compartilhamento e exclusão.
          Você mesmo pode{" "}
          <Link
            href="/profile"
            className="text-primary underline underline-offset-4"
          >
            excluir a sua conta
          </Link>{" "}
          a qualquer momento, na página do perfil. Para os outros pedidos,
          escreva para <ContactLink />.
        </p>
      </LegalSection>

      <LegalSection title="Segurança">
        <p>
          A conexão com o site é cifrada, o acesso ao banco de dados usa
          credenciais separadas para conteúdo público e para dados pessoais, e
          cada pessoa só consegue ver e alterar os próprios dados. Nenhum
          sistema é totalmente imune a falhas; se algo acontecer que afete os
          seus dados, avisaremos pelo e-mail da conta.
        </p>
      </LegalSection>

      <LegalSection title="Menores de idade">
        <p>
          O serviço é destinado a maiores de 18 anos. Não criamos contas de
          menores intencionalmente.
        </p>
      </LegalSection>

      <LegalSection title="Mudanças nesta política">
        <p>
          Se esta política mudar, a data no topo será atualizada. Mudanças
          importantes serão avisadas no site ou por e-mail.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
