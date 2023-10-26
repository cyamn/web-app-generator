# Timeline

## Bachelorarbeit

- TOC zeigen
- TOC besprechen

## Software zeigen

- Project erstellung
- Page Code editor
- Page WYSIWYG editor
- Permissions
- Import/Export

Codeschnipsel:

```json example page
{
  "name": "Example",
  "path": "example",
  "access": {
    "public": false,
    "canView": []
  },
  "variables": {},
  "dashboards": [
    {
      "type": "markdown",
      "parameters": {
        "markdown": "# Markdown dashboard"
      }
    }
  ]
}
```

```json markdown
      "type": "markdown",
      "parameters": {
        "markdown": "# Personen\n\nHallo $user.name!\n\nBitte trage dich unten zu den anderen $number_of_people Leuten ein"
      }
```

```json variable
    "magic_number": 42,
    "number_of_people": "=COUNT_ROWS(\"people\")"
```

```json table view
    ,{
      "type": "databaseView",
      "parameters": {
        "data": {
          "table": "people",
          "columns": {
            "active": "Aktiv",
            "name": "Name",
            "years_active": "Jahre aktiv"
          }
        },
        "format": {
        }
      }
    }
```

```json filter
,"filter": [
            {
              "column": "years_active",
              "operator": "gt",
              "value": 10
            }
          ]
```

```json controls
        "format": {
          "controls": {
            "delete": "Löschen",
            "duplicate": "Dublizieren",
            "edit": "Bearbeiten"
          }
        }
```

```json input form
      ,{
      "type": "databaseInputForm",
      "parameters": {
        "data": {
          "table": "people",
          "columns": {
            "active": "Active",
            "name": "Name",
            "years_active": "Years Active"
          },
          "filter": [
            {
              "column": "years_active",
              "operator": "gt",
              "value": 10
            }
          ]
        },
        "input": {
          "mode": "create"
        }
      }
    }
```

## Feedback

- ??

https://bubble.io/
https://www.wix.com/
https://wordpress.org/
https://webflow.com/
https://www.squarespace.com/
https://github.com/nocodb/nocodb
https://www.notion.so
https://coda.io/
https://rubyonrails.org/
https://github.com/muesli-hd
https://muesli.mathi.uni-heidelberg.de
https://nextjs.org/
https://trpc.io/
https://www.prisma.io/
https://next-auth.js.org/
https://github.com/colinhacks/zod
https://github.com/LesterLyu/fast-formula-parser
