import { Injectable, Logger } from '@nestjs/common';
import { CupomService } from '../cupom/cupom.service.js';

@Injectable()
export class RecomendoService {
  private readonly logger = new Logger(RecomendoService.name);

  // ✅ LISTA DE LOJAS PERMITIDAS (Adicione as lojas que você é afiliado)
  // Se a loja não estiver aqui, o cupom é ignorado.
  private readonly LOJAS_PERMITIDAS = [
    'kabum', 
    'brinox',
    'ninja',
    'electrolux',
    // Adicione outras que você encontrar na lista do Recomendo
  ];

  constructor(private readonly cupomService: CupomService) {}

  async sincronizar() {
    this.logger.log('Iniciando sincronização de cupons com a API Recomendo...');
    try {
      const response = await fetch('https://recomendo.org/api/v1/cupons.json');
      if (!response.ok) throw new Error('Falha ao buscar cupons da API');

      const data = await response.json();
      const cupons = data.cupons || data;

      let criados = 0;
      let atualizados = 0;
      let ignorados = 0;

      for (const item of cupons) {
        if (!item.codigo) continue;

        // ✅ Verifica se a loja está na lista de permitidas
        const lojaNome = typeof item.loja === 'object' ? item.loja?.nome : item.loja;
        const slugLoja = typeof item.loja === 'object' ? item.loja?.slug : lojaNome;
        
        // Se não estiver na lista, ignora e pula para o próximo
        if (!slugLoja || !this.LOJAS_PERMITIDAS.some(l => slugLoja.toLowerCase().includes(l.toLowerCase()))) {
          ignorados++;
          continue;
        }

        let url = item.link || '';
        if (url.includes('awin1.com/cread.php')) {
          url = url.includes('?') ? `${url}&clickref=emcheio` : `${url}?clickref=emcheio`;
        }

        const cupomData = {
          loja: (lojaNome || 'Desconhecida').substring(0, 50),
          codigo: item.codigo.substring(0, 50),
          descontoTexto: (item.titulo || item.desconto || 'Desconto').substring(0, 50),
          condicoes: item.termos || '',
          urlAfiliado: url,
          validadeFim: item.fim ? new Date(item.fim) : null,
        };

        const resultado = await this.cupomService.salvarCupomRecomendo(cupomData);
        
        if (resultado === 'criado') criados++;
        else if (resultado === 'atualizado') atualizados++;
        else ignorados++;
      }

      this.logger.log(`Sincronização concluída: ${criados} criados, ${atualizados} atualizados, ${ignorados} ignorados (lojas não permitidas).`);
      return { criados, atualizados, ignorados };
    } catch (error) {
      this.logger.error('Erro na sincronização de cupons', error);
      throw error;
    }
  }
}