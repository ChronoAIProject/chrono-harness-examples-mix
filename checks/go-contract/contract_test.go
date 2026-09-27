package contract

import (
 "testing"
 "encoding/json"
 "os"
 rates "example.invalid/rates"
)

func TestContract(t *testing.T) {
 for _, c := range []struct{ units, want int }{{-1,0},{0,0},{1,125},{9,1125},{10,1000},{20,2000}} {
  if got := rates.Total(c.units); got != c.want { t.Fatalf("Total(%d)=%d; want %d", c.units, got, c.want) }
 }
}

func TestSharedInvoice(t *testing.T) {
 data, err := os.ReadFile("../../contracts/invoice.json"); if err != nil { t.Fatal(err) }
 var invoice struct { Units int; Cents int }; if err := json.Unmarshal(data, &invoice); err != nil { t.Fatal(err) }
 if got := rates.Total(invoice.Units); got != invoice.Cents { t.Fatalf("invoice got %d, want %d", got, invoice.Cents) }
}
