import os
import psycopg2
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерирует sitemap.xml для поисковых систем
    GET / - возвращает sitemap со всеми публичными визитками
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': '{"error": "Method not allowed"}',
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, updated_at 
            FROM t_p18253922_infinite_business_ca.business_cards 
            WHERE created_at IS NOT NULL
            ORDER BY updated_at DESC
            LIMIT 1000
        """)
        cards = cur.fetchall()
        
        base_url = 'https://infinite7.cards'
        sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        sitemap_xml += f'''  <url>
    <loc>{base_url}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n'''
        
        for card_id, updated_at in cards:
            lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else datetime.now().strftime('%Y-%m-%d')
            sitemap_xml += f'''  <url>
    <loc>{base_url}/card/{card_id}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n'''
        
        sitemap_xml += '</urlset>'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': sitemap_xml,
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': f'{{"error": "{str(e)}"}}',
            'isBase64Encoded': False
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
