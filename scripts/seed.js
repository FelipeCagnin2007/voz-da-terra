import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simples parser de .env
const envPath = path.resolve(process.cwd(), '.env')
const env = fs.readFileSync(envPath, 'utf-8')
const getEnv = (key) => env.match(new RegExp(`${key}=(.*)`))?.[1]?.trim()

const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY')

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais Supabase não encontradas no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Iniciando seeding do banco de dados...')

  const articles = [
    {
      titulo: 'O Futuro das Energias Renováveis',
      tag: 'Ecossistema',
      imagem_url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&w=1200&q=80',
      conteudo: 'As energias renováveis são o pilar da transição energética global. Com o avanço tecnológico em células fotovoltaicas e turbinas eólicas, o custo de produção de energia limpa caiu drasticamente nos últimos anos. No Brasil, o potencial solar e eólico é vasto, especialmente no Nordeste, onde os ventos constantes alimentam grandes parques eólicos que já suprem boa parte da demanda regional.',
    },
    {
      titulo: 'Como Reduzir o Plástico no Dia a Dia',
      tag: 'Mudança Climática',
      imagem_url: 'https://images.unsplash.com/photo-1591193516411-91a69beca02e?auto=format&fit=crop&w=1200&q=80',
      conteudo: 'O plástico é um dos maiores poluentes dos oceanos, levando centenas de anos para se decompor. Pequenas mudanças de hábito podem gerar um grande impacto. Trocar sacolas plásticas por ecobags, evitar canudos descartáveis e optar por produtos com embalagens de papel ou vidro são passos simples que todos podem dar. Além disso, a separação correta dos resíduos recicláveis garante que o plástico que consumimos retorne ao ciclo de produção, reduzindo a extração de petróleo.',
    },
    {
      titulo: 'A Importância das Abelhas para o Ecossistema',
      tag: 'Biodiversidade',
      imagem_url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
      conteudo: 'As abelhas são responsáveis pela polinização de cerca de 70% das culturas agrícolas que alimentam o mundo. Sem elas, a biodiversidade e a segurança alimentar global estariam em sério risco. O uso extensivo de pesticidas e a fragmentação de habitats têm causado o declínio das colmeias. Proteger as abelhas é, em última análise, proteger a nossa própria sobrevivência e a saúde de todos os ecossistemas terrestres.',
    }
  ]

  const projects = [
    {
      titulo: 'Horta Comunitária Urbana',
      tag: 'Reciclagem',
      imagem_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      conteudo: 'Transformamos terrenos baldios no centro da cidade em fontes de alimento orgânico. Nosso projeto utiliza compostagem de resíduos locais para nutrir o solo, criando um ciclo fechado de sustentabilidade e fortalecendo os laços da comunidade através do plantio coletivo.',
    },
    {
      titulo: 'Reflorestamento de Nascentes',
      tag: 'Sustentabilidade',
      imagem_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
      conteudo: 'Estamos plantando mudas nativas em áreas críticas de preservação para garantir o fluxo de água nas nossas bacias hidrográficas. A vegetação ciliar funciona como um filtro natural, evitando o assoreamento dos rios e promovendo o retorno da fauna local.',
    }
  ]

  console.log('📚 Inserindo artigos...')
  const { error: artError } = await supabase.from('artigos').insert(articles)
  if (artError) console.error('Erro ao inserir artigos:', artError)
  else console.log('✅ Artigos inseridos com sucesso!')

  console.log('🏗️ Inserindo projetos...')
  const { error: projError } = await supabase.from('projetos').insert(projects)
  if (projError) console.error('Erro ao inserir projetos:', projError)
  else console.log('✅ Projetos inseridos com sucesso!')

  console.log('🌿 Seeding finalizado!')
}

seed().catch(console.error)
