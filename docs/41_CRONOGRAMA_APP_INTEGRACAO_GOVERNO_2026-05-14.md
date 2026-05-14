# Checkpoint - Cronograma App e Integracao Governamental

Data: 2026-05-14
Coordenacao: Ze
Especialistas considerados: Silvio, Katia, Fabio, Demi, Tereza, Eliane, Cristine, Doneda, Lina, Tarcila, Lucena e Ruth

## Motivo

As atualizacoes dos portais Governo/Business e do pacote Governo/PB criaram uma trilha mais clara de sustentabilidade por piloto, operacao assistida, convenios/contratos, suporte e manutencao institucional.

Este checkpoint registra o impacto no app mobile para evitar que a continuidade Android avance desalinhada com os requisitos futuros de integracao governamental.

## Decisao

- Nao ha bloqueio para continuar a Frente 1.3 no Android.
- Android permanece como foco de conclusao do MVP.
- iPhone/iOS permanece pos-MVP.
- Integracao governamental real permanece fora do MVP e entra apenas em frente futura condicionada.
- A proxima evolucao viavel apos a Frente 1.3 continua sendo anjos/convites, nao conveniados ou orgaos publicos.

## Efeito no cronograma tecnico

| Ordem | Frente | Estado | Observacao |
|---:|---|---|---|
| 1 | Chaves reais por dispositivo | Concluida | Manter chave privada somente no aparelho |
| 2 | Midia critica Android | Concluida para MVP Android | iOS fica pos-MVP |
| 3 | Perfis, familia, maioridade e papeis | Em fechamento | Backend publicado, Android validado, UX fonte ampliada com ressalva |
| 4 | Anjos e convites | Proxima | Depende de perfis, vinculos, autorizacoes e consentimentos |
| 5 | Ocorrencia SOS e roteamento | Futura | Depende de anjos autorizados e outbox idempotente |
| 6 | Chamada audio/video | Futura | Depende de ocorrencia ativa e WebRTC nativo |
| 7 | Midia operacional/nuvem cifrada | Futura | Depende de envelopes, retencao, auditoria e upload retomavel |
| 8 | Localizacao em tempo real | Futura | Canal separado, consentido e encerravel |
| 9 | Conveniados, orgaos e governo | Futura condicionada | Depende de instrumento formal, homologacao, RIPD/DPIA, ePING/OpenAPI, RBAC/MFA e protocolo humano |
| 10 | Operacao definitiva e lojas | Futura | Depende de SLA/SLO, suporte, observabilidade, incidentes e go-live assistido |

## Requisitos que o app deve preservar desde agora

- contratos de API auditaveis;
- consentimentos versionados;
- minimizacao de dados;
- logs saneados;
- separacao de papeis;
- bloqueios server-side para menores;
- trilha de auditoria para convites, anjos, ocorrencias e autorizacoes;
- compatibilidade futura com OpenAPI/ePING sem ativar integracao publica;
- feature flags desligadas por padrao para conveniados, orgaos, smart cities e tornozeleira/proximidade.

## Gate Governo futuro

Antes de qualquer integracao real com orgao publico:

- mesa tecnica autorizada;
- ACT, convênio, contrato ou instrumento equivalente;
- acordo de dados/DPA;
- RIPD/DPIA;
- homologacao tecnica;
- OpenAPI/ePING validado;
- RBAC/MFA, auditoria, retencao e logs saneados;
- protocolo de evidencia digital;
- protocolo humano de resposta;
- suporte, observabilidade, SLA/SLO, incidentes e contingencia;
- aprovacao juridica, seguranca, QA e UX.

## Tornozeleira/proximidade

Permanece apenas como possibilidade tecnica futura. O app nao deve receber nem exibir mapa ou localizacao continua do agressor ao particular.

Se algum dia for autorizado, o desenho recomendado e receber evento minimo de uma central publica competente, homologada e juridicamente autorizada, para orientar a usuaria e acionar a autoridade competente sem incentivar confrontacao.

## Proxima acao

Continuar a Frente 1.3 Android:

- preservar perfil sincronizado com a API;
- manter bloqueio de menor convidar ou atuar como anjo;
- manter responsavel com menor dependente condicionado a protegido, vinculo e autorizacao ativos;
- corrigir a ressalva UX de fonte ampliada antes de fechar a frente sem ressalvas;
- nao ativar integracao publica nesta etapa.
