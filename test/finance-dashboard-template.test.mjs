import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {listTemplateDirectories, templateArea} from '../scripts/showcase-lib.mjs';
const require=createRequire(import.meta.url);
const finance=require('../src/finance-dashboard/assets/main.js');
const {MONTHS,initialMovements,totalsFor,monthlySeries,budgetStatus,filterMovements,toCsv,parseAmount,validateMovement,comparison}=finance;

test('finance catalogue entry, local assets and PT-PT markup are available',async()=>{
  const entry=(await listTemplateDirectories()).find(t=>t.slug==='finance-dashboard');
  assert.ok(entry);assert.match(entry.name,/Balanço/);assert.equal(templateArea(entry),'Finanças');
  const html=await readFile('src/finance-dashboard/index.html','utf8');
  for(const file of ['assets/main.js','assets/style.css']){assert.ok(html.includes(file));assert.ok((await readFile(`src/finance-dashboard/${file}`,'utf8')).length>0);}
  assert.match(html,/lang="pt-PT"/);
  assert.match(html,/<dialog id="movement-dialog"/);
  assert.doesNotMatch(html,/(src|href)="https?:/);
});

test('monthly totals reconcile: income minus expenses equals balance and series matches each month',()=>{
  const series=monthlySeries(initialMovements);
  assert.equal(series.length,MONTHS.length);
  for(const item of series){
    assert.equal(item.income-item.expenses,item.balance);
    assert.deepEqual(totalsFor(initialMovements,item.month),item);
    assert.ok(Number.isInteger(item.income)&&Number.isInteger(item.expenses));
  }
});

test('budgets sum to the expenses of the month and flag overruns',()=>{
  for(const month of MONTHS){
    const budgets=budgetStatus(initialMovements,month);
    assert.ok(budgets.length>0);
    const spent=budgets.reduce((s,b)=>s+b.spent,0);
    const expensesWithBudget=initialMovements.filter(m=>m.date.startsWith(month)&&budgets.some(b=>b.id===m.categoryId)).reduce((s,m)=>s+m.amount,0);
    assert.equal(spent,expensesWithBudget);
    for(const b of budgets)assert.equal(b.remaining,b.budget-b.spent);
  }
  const july=budgetStatus(initialMovements,'2026-07').find(b=>b.id==='transportes');
  assert.ok(july.remaining<0);
});

test('search ignores accents and case, and filters compose',()=>{
  const base={month:'2026-11'};
  assert.ok(filterMovements(initialMovements,{...base,query:'  SUPERMERCADO '}).length>0);
  assert.ok(filterMovements(initialMovements,{...base,query:'alimentacao'}).every(m=>m.categoryId==='alimentacao'));
  assert.equal(filterMovements(initialMovements,{...base,query:'inexistente'}).length,0);
  assert.ok(filterMovements(initialMovements,{...base,type:'receita'}).every(m=>finance.categoryById(m.categoryId).type==='receita'));
  assert.ok(filterMovements(initialMovements,{...base,type:'despesa',categoryId:'saude'}).every(m=>m.categoryId==='saude'));
  assert.ok(filterMovements(initialMovements,{month:'2026-06'}).every(m=>m.date.startsWith('2026-06')));
});

test('sorting orders by date or amount deterministically',()=>{
  const recent=filterMovements(initialMovements,{month:'2026-10',sort:'recent'});
  assert.ok(recent.every((m,i)=>i===0||recent[i-1].date>=m.date));
  const oldest=filterMovements(initialMovements,{month:'2026-10',sort:'oldest'});
  assert.ok(oldest.every((m,i)=>i===0||oldest[i-1].date<=m.date));
  const amount=filterMovements(initialMovements,{month:'2026-10',sort:'amount'});
  assert.ok(amount.every((m,i)=>i===0||amount[i-1].amount>=m.amount));
});

test('month-over-month comparison is null for the first month and a fraction otherwise',()=>{
  assert.deepEqual(comparison(initialMovements,'2026-06'),{income:null,expenses:null});
  const change=comparison(initialMovements,'2026-11');
  assert.ok(Math.abs(change.expenses-((1405.99-1551.19)/1551.19))<1e-9);
});

test('CSV export uses BOM, semicolons, decimal commas and neutralises formulas',()=>{
  const rows=[
    {id:'a',date:'2026-11-02',description:'=HYPERLINK("x")',categoryId:'alimentacao',amount:12780},
    {id:'b',date:'2026-11-03',description:'Jantar; "bom"',categoryId:'salario',amount:215000}
  ];
  const csv=toCsv(rows);
  assert.ok(csv.startsWith('\uFEFFData;Descrição;Categoria;Tipo;Valor (€)\r\n'));
  assert.match(csv,/2026-11-02;"'=HYPERLINK\(""x""\)";Alimentação;Despesa;127,80/);
  assert.match(csv,/"Jantar; ""bom"""/);
  assert.match(csv,/;Receita;2150,00/);
});

test('amount parsing accepts PT and EN decimal formats and rejects invalid values',()=>{
  assert.equal(parseAmount('12,5'),1250);
  assert.equal(parseAmount('12.50'),1250);
  assert.equal(parseAmount('1 200'),120000);
  assert.equal(parseAmount('0'),null);
  assert.equal(parseAmount('-3'),null);
  assert.equal(parseAmount('12,345'),null);
  assert.equal(parseAmount('abc'),null);
  assert.equal(parseAmount('2000000'),null);
});

test('movement validation reports each invalid field and accepts a valid demo movement',()=>{
  const valid={type:'despesa',description:'  Café  ',amount:'3,40',categoryId:'lazer',date:'2026-11-12'};
  assert.deepEqual(validateMovement(valid,'2026-11'),{movement:{description:'Café',amount:340,categoryId:'lazer',date:'2026-11-12'}});
  const invalid=validateMovement({type:'receita',description:'a',amount:'',categoryId:'lazer',date:'2026-10-31'},'2026-11');
  assert.deepEqual(Object.keys(invalid.errors).sort(),['amount','categoryId','date','description']);
  assert.ok(validateMovement({...valid,date:'2026-11-31'},'2026-11').errors.date);
  assert.ok(validateMovement({...valid,date:'2026-02-30'},'2026-02').errors.date);
});
