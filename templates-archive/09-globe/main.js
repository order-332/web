"use strict";
(() => {
  const root = document.querySelector(".gl"), cv = document.getElementById("globe"), fx = document.getElementById("fx");
  const g = cv.getContext("2d"), f = fx.getContext("2d"), tip = document.getElementById("tip"), meta = document.getElementById("meta");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = Math.PI / 180;

  // land: equal-area dot grid, lat/lon packed as uint16 pairs
  const raw = atob("YAFGBGABYgRwATgEcAFTBIABKwSAAUUEgAGsBIABxQSQAR8EkAE4BJABUQSgARsEoAEzBKABSwSgAWMEsAEoBLABPwSwAVYEwAEzBMABSgTAAWEEwAGTDcABqg3QAS8E0AFFBNABWwTQAXEE0AGtDdABww3gASsE4AFBBOABVgTgAWwE4AHCDOABxQ3wAScE8AE8BPABUQTwAWYE8AF7BPABkAQAAjgEAAJNBAACYQQAAnYEAAKKBAACnwQAAr0MAALdDQAC8Q0QAjQEEAJIBBACXAQQAnAEEAKEBBACmQQQAq0EEALBBBACiAwQApwMEAKwDBACxAwQAtgMEALeDSACRAQgAlcEIAJrBCACfwQgApIEIAKmBCACugQgAn0MIAKQDCACpAwgArgMIALLDCAC3wwwAkAEMAJTBDACZgQwAnkEMAKNBDACoAQwArMEMALGBDAC2gQwAu0EMALJBzAC3AcwAosLMAKeCzACsgswAnIMMAKFDDACmQwwAqwMMAK/DDAC0gwwAuYMQAJBBEACVARAAmcEQAJ6BEACjQRAAqAEQAKzBEACxgRAAtkEQALsBEACzwdAAuIHQAL1B0ACCAhAAhsIQAKVC0ACqAtAArsLQALOC0AC4QtAAlMMQAJmDEACeQxAAowMQAKfDEACsQxAAsQMQALXDEAC6gxQAkMEUAJWBFACaARQAnsEUAKOBFACoARQArMEUALGBFAC2ARQAusEUAL+BFACwwdQAtUHUALoB1AC+gdQAg0IUAIgCFACMghQAowLUAKfC1ACsgtQAsQLUALXC1AC6gtQAvwLUAIPDFACIgxQAjQMUAJHDFACWgxQAmwMUAJ/DFACkgxQAqQMUAK3DFACygxQAtwMUALvDFACAg1gAkUEYAJXBGACagRgAnwEYAKOBGACoQRgArMEYALFBGAC2ARgAuoEYAL9BGACDwVgArYHYALJB2AC2wdgAu4HYAIACGACEghgAiUIYAI3CGAClgtgAqkLYAK7C2ACzQtgAuALYALyC2ACBQxgAhcMYAIpDGACPAxgAk4MYAJgDGACcwxgAoUMYAKXDGACqgxgArwMYALPDGAC4QxgAvMMYAIGDXACRgRwAlkEcAJrBHACfQRwAo8EcAKhBHACswRwAsUEcALXBHAC6QRwAvsEcAINBXACIAVwAqsHcAK9B3ACzwdwAuEHcALzB3ACBQhwAhcIcAIpCHACPAhwAo4LcAKgC3ACsgtwAsQLcALWC3AC6AtwAvoLcAIMDHACHwxwAjEMcAJDDHACVQxwAmcMcAJ5DHACiwxwAp0McAKvDHACwQxwAtMMcALmDHAC+AyAAkgEgAJaBIACbASAAn4EgAKPBIACoQSAArMEgALFBIAC1wSAAugEgAL6BIACDAWAAh4FgAKfB4ACsQeAAsMHgALVB4AC5weAAvkHgAIKCIACHAiAAi4IgAJACIAChguAApcLgAKpC4ACuwuAAs0LgALfC4AC8AuAAgIMgAIUDIACJgyAAjgMgAJKDIACWwyAAm0MgAJ/DIACkQyAAqMMgAK0DIACxgyAAtgMgALqDIAC/AyQAkoEkAJbBJACbQSQAn4EkAKQBJACoQSQArMEkALEBJAC1gSQAugEkAL5BJACCwWQAhwFkAIuBZACpgeQArgHkALJB5AC2weQAuwHkAL+B5ACDwiQAiEIkAIzCJACRAiQAlYIkAJnCJACvwiQAtEIkAJ9C5ACjwuQAqELkAKyC5ACxAuQAtULkALnC5AC+AuQAgoMkAIcDJACLQyQAj8MkAJQDJACYgyQAnMMkAKFDJAClgyQAqgMkAK6DJACywyQAt0MkALuDKACUASgAmIEoAJzBKAChQSgApYEoAKnBKACuQSgAsoEoALbBKAC7QSgAv4EoAIQBaACIQWgAjIFoAJEBaACVQWgAqUHoAK2B6ACxwegAtkHoALqB6AC+wegAg0IoAIeCKACMAigAkEIoAJSCKACZAigArsIoALMCKAC3gigAoQLoAKVC6ACpwugArgLoALJC6AC2wugAuwLoAL+C6ACDwygAiAMoAIyDKACQwygAlUMoAJmDKACdwygAokMoAKaDKACqwygAr0MoALODKAC4AywAlIEsAJjBLACdASwAoUEsAKWBLACpwSwArkEsALKBLAC2wSwAuwEsAL9BLACDgWwAh8FsAIxBbACQgWwAlMFsAJkBbACmgewAqsHsAK8B7ACzQewAt4HsALvB7ACAQiwAhIIsAIjCLACNAiwAkUIsAJWCLACzgiwAt8IsAKeC7ACrwuwAsELsALSC7AC4wuwAvQLsAIFDLACFgywAicMsAI5DLACSgywAlsMsAJsDLACfQywAo4MsAKfDLACsQywAsIMsALTDLACfg3AAlgEwAJpBMACegTAAosEwAKcBMACrQTAAr4EwALPBMAC4ATAAvEEwAICBcACEwXAAiQFwAI1BcACRgXAAlcFwAJoBcACeQXAApgHwAKpB8ACugfAAssHwALcB8AC7QfAAv4HwAIPCMACIAjAAjEIwAJCCMACUwjAAmQIwALKCMAC2wjAAuwIwALGC8AC1wvAAugLwAL5C8ACCgzAAhsMwAIsDMACPQzAAk4MwAJfDMACcAzAAoEMwAKSDMACowzAArQMwALFDNACTgTQAl8E0AJwBNACgATQApEE0AKiBNACswTQAsQE0ALUBNAC5QTQAvYE0AIHBdACGAXQAikF0AI5BdACSgXQAlsF0AJsBdACfQXQAoYH0AKXB9ACqAfQArkH0ALJB9AC2gfQAusH0AL8B9ACDQjQAh4I0AIuCNACPwjQAlAI0AJhCNACcgjQAsYI0ALXCNAC5wjQAtwL0ALtC9AC/gvQAg8M0AIgDNACMQzQAkEM0AJSDNACYwzQAnQM0AKFDNAClQzQAqYM0AK3DNAC9w3gAjME4AJEBOACVATgAmUE4AJ2BOAChgTgApcE4AKoBOACuATgAskE4ALaBOAC6gTgAvsE4AIMBeACHAXgAi0F4AI+BeACTgXgAl8F4AJwBeACgAXgAoUH4AKWB+ACpgfgArcH4ALIB+AC2AfgAukH4AL6B+ACCgjgAhsI4AIsCOACPAjgAk0I4AJeCOACbgjgAn8I4AKQCOAC0gjgAuMI4AL0COAC4gvgAvIL4AIDDOACFAzgAiQM4AI1DOACRgzgAlYM4AJnDOACmQzgAqoM4AKTDfACGQTwAikE8AI6BPACSgTwAlsE8AJrBPACfATwAowE8AKdBPACrQTwAr4E8ALOBPAC3wTwAu8E8AIABfACEAXwAiEF8AIxBfACQgXwAlIF8AJjBfACcwXwAoQH8AKUB/ACpQfwArUH8ALGB/AC1gfwAucH8AL3B/ACCAjwAhgI8AIpCPACOgjwAkoI8AJbCPACawjwAnwI8AKMCPACnQjwAu8I8AL3C/ACCAzwAhgM8AIpDPACOQzwAkoM8AKcDPACrQwAAxQEAAMkBAADNQQAA0UEAANWBAADZgQAA3YEAAOHBAADlwQAA6gEAAO4BAADyQQAA9kEAAPqBAAD+gQAAwoFAAMbBQADKwUAAzwFAANMBQADXQUAA20FAAN9BQADjAcAA5wHAAOsBwADvQcAA80HAAPeBwAD7gcAA/8HAAMPCAADHwgAAzAIAANACAADUQgAA2EIAANyCAADgggAA5MIAAP1CAADKwwAAzwMAANMDAADngwQAw8EEAMfBBADMAQQA0AEEANRBBADYQQQA3EEEAOCBBADkgQQA6IEEAOzBBADwwQQA9MEEAPkBBAD9AQQAwUFEAMVBRADJQUQAzYFEANGBRADVgUQA2cFEAN3BRADhwUQA5MHEAOjBxADtAcQA8QHEAPVBxAD5QcQA/UHEAMGCBADFggQAyYIEAM3CBADRwgQA1cIEANoCBADeAgQA4kIEAOZCCADBgQgAxYEIAMmBCADNgQgA0cEIANXBCADZwQgA3cEIAOHBCADmAQgA6gEIAO4BCADyAQgA9kEIAPpBCAD+QQgAwkFIAMZBSADKgUgAzoFIANKBSADWgUgA2oFIAN7BSADiwUgA5sFIAOSByADogcgA7IHIAPCByAD0wcgA+MHIAPzByADAwggAxQIIAMkCCADNAggA0QIIANUCCADZQggA3UIIAOFCCADlQggA+ELIAPUDCAD5AwwAwEEMAMRBDADIQQwAzIEMANCBDADUgQwA2IEMANyBDADggQwA5IEMAOjBDADswQwA8MEMAPTBDAD4wQwA/MEMAMDBTADFAUwAyQFMAM0BTADRAUwA1QFMANkBTADdAUwA4UFMAOVBTADpQUwA5kHMAOpBzADugcwA8oHMAPaBzAD6gcwA/oHMAMKCDADGggwAysIMAM7CDADSwgwA1sIMANrCDADewgwA4sIMAOCCzADogswA9MLMAOEDDADlQwwA8UMMANGDUAD8QNAAwEEQAMRBEADIQRAAzIEQANCBEADUgRAA2IEQANyBEADggRAA5IEQAOjBEADswRAA8MEQAPTBEAD4wRAA/MEQAMDBUADFAVAAyQFQAM0BUADRAVAA1QFQANkBUADdAVAA4UFQAOVBUADpQVAA4kHQAOZB0ADqQdAA7oHQAPKB0AD2gdAA+oHQAP6B0ADCghAAxoIQAMrCEADOwhAA0sIQANbCEADawhAA3sIQAOLCEADMQtAA0ILQANiC0ADdAxAA4QMQAOVDEADpQxAA7UMQAPFDEADJg1QA9wDUAPsA1AD/QNQAw0EUAMdBFADLQRQAz0EUANNBFADXQRQA20EUAN9BFADjQRQA50EUAOtBFADvQRQA80EUAPeBFAD7gRQA/4EUAMOBVADHgVQAy4FUAM+BVADTgVQA14FUANuBVADfgVQA44FUAOeBVADgQdQA5EHUAOhB1ADsQdQA8EHUAPRB1AD4QdQA/EHUAMBCFADEQhQAyEIUAMxCFADQQhQA1EIUANiCFADcghQA4IIUAMlC1ADtQtQA9ULUAN2DFADhgxQA5YMUAOmDFADtgxQA/cMYAPoA2AD+ANgAwgEYAMYBGADKARgAzgEYANIBGADWARgA2gEYAN4BGADiARgA5gEYAOoBGADuARgA8gEYAPYBGAD6ARgA/gEYAMIBWADGAVgAygFYAM4BWADSAVgA1gFYANoBWADeAVgA3gHYAOIB2ADmAdgA6gHYAO4B2ADyAdgA9gHYAPoB2AD+AdgAwgIYAMYCGADKAhgAzgIYANICGADWAhgA2gIYAN4CGADiAhgAwgLYAMYC2ADKAtgA4gLYAO4C2ADyAtgA/gLYAM4DGADSAxgA1gMYANoDGADeAxgA4gMYAOYDHAD6ANwA/gDcAMIBHADGARwAygEcAM4BHADSARwA1gEcANoBHADeARwA4gEcAOYBHADqARwA7gEcAPIBHAD2ARwA+gEcAP4BHADCAVwAxgFcAMoBXADOAVwA0gFcANoB3ADeAdwA4gHcAOYB3ADqAdwA7gHcAPIB3AD2AdwA+gHcAP4B3ADCAhwAxgIcAMoCHADOAhwA0gIcANYCHADaAhwA3gIcAOICHADmAhwAwgLcAMYC3ADWAtwA2gLcAN4C3ADiAtwA7gLcAM4DHADaAyAA+gDgAP4A4ADCASAAxgEgAMoBIADOASAA0gEgANYBIADaASAA3gEgAOIBIADmASAA6gEgAO4BIADyASAA9gEgAPoBIAD+ASAAwgFgAMYBYADaAeAA3gHgAOIB4ADmAeAA6gHgAO4B4ADyAeAA9gHgAPoB4AD+AeAAwgIgAMYCIADKAiAAzgIgANICIADWAiAA2gIgAN4CIADiAiAA5gIgAOoCIAD+AqAAwgLgANYC4ADaAuAA3gLgAOIC4ADmAuAA7gLgAMIDJAD+AOQAwgEkAMYBJADKASQAzgEkANIBJADWASQA2gEkAN4BJADiASQA5gEkAOoBJADuASQA8gEkAPYBJAD6ASQA/gEkAMIBZADaAeQA3gHkAOIB5ADmAeQA6gHkAO4B5ADyAeQA9gHkAPoB5AD+AeQAwgIkAMYCJADKAiQAzgIkANICJADWAiQA2gIkAN4CJADiAiQA5gIkAOoCJADuAiQA+gKkAP4CpADCAuQA1gLkANoC5ADeAuQA4gLkAOYC5ADqAuQA+gLkAMIDKADCASgAxgEoAMoBKADOASgA0gEoANYBKADaASgA3gEoAOIBKADmASgA6gEoAO4BKADyASgA9gEoAPoBKAD+ASgAwgFoAN4B6ADiAegA5gHoAOoB6ADuAegA8gHoAPYB6AD6AegA/gHoAMICKADGAigAygIoAM4CKADSAigA1gIoANoCKADeAigA4gIoAOYCKADqAigA7gIoAPICKAD2AigA9gKoAPoCqADCAugA2gLoAN4C6ADiAugA5gLsAMNBLADHQSwAy0EsAM9BLADTQSwA10EsANtBLADfQSwA40EsAOdBLADrQSwA70EsAPNBLAD3gSwA+4EsAP+BLADYAewA3AHsAOBB7ADkQewA6EHsAOxB7ADwQewA9EHsAPhB7AD8QewAwEIsAMRCLADIQiwAzEIsANBCLADUQiwA2IIsANyCLADggiwA5IIsAOiCLADsgiwA8IIsAPSCLAD4giwA9QKsAMFC7ADhQuwA5ULsAOlC8ADDQTAAx0EwAMtBMADPQTAA00EwANdBMADbQTAA30EwAONBMADnQTAA60EwAO9BMADoAbAA7AGwAPABsAD0AbAA+AGwAPwBsADAAfAAxAHwANAB8ADUAfAA2AHwANwB8ADgQfAA5EHwAOhB8ADsQfAA8EHwAPRB8AD4QfAA/EHwAMBCMADEQjAAyEIwAMxCMADQQjAA1EIwANiCMADcgjAA4IIwAOSCMADogjAA7IIwAPCCMAD0gjAA+IIwAP0CsADBQvAA5ULwAPmC9AD4QPQAwEE0AMRBNADIQTQAzIE0ANCBNADUgTQA2IE0ANyBNADggTQA5IE0AOjBNADswTQA5cG0AOnBtADtwbQA8cG0APYBtAD6AbQA/gG0AMIB9ADGAfQAygH0AM4B9ADSQfQA1kH0ANpB9ADeQfQA4kH0AOZB9ADqQfQA7oH0APKB9AD2gfQA+oH0AP6B9ADCgjQAxoI0AMrCNADOwjQA0sI0ANbCNADawjQA3sI0AOLCNADnAjQA6wI0AO8CNADzAjQA9wI0APsCNADLwrQA/EK0APTC9AD4wvQA/ML4APFA+AD9gPgAxYE4AMmBOADNgTgA0cE4ANXBOADZwTgA3cE4AOHBOADmATgA6gE4AOOBuADnwbgA68G4AO/BuADzwbgA98G4APwBuADAAfgAxAH4AMgB+ADMQfgA0EH4ANRB+ADYQfgA3EH4AOCB+ADkgfgA6IH4AOyB+ADwgfgA9MH4APjB+AD8wfgAwMI4AMUCOADJAjgAzQI4ANECOADVAjgA2UI4AN1COADhQjgA5UI4AOmCOADtgjgA8YI4APWCOAD5gjgA/cI4AMKCuADGgrgAysK4APtCuAD8QvwA7kD8AMbBPADKwTwAzsE8ANMBPADXATwA3UG8AOGBvADlgbwA6YG8AO3BvADxwbwA9cG8APnBvAD+AbwAwgH8AMYB/ADKQfwAzkH8ANJB/ADWQfwA2oH8AN6B/ADigfwA5sH8AOrB/ADuwfwA8sH8APcB/AD7AfwA/wH8AMNCPADHQjwAy0I8AM+CPADTgjwA14I8ANuCPADfwjwA48I8AOfCPADsAjwA+AI8APxCPADAQnwAwYK8AMWCvADJgrwA+oK8AMbC/ADKwvwAzsL8APOC/AD3gsABK0DAAS9AwAEbQYABH0GAASNBgAEngYABK4GAAS+BgAEzwYABN8GAATvBgAEAAcABBAHAAQhBwAEMQcABEEHAARSBwAEYgcABHIHAASDBwAEkwcABKMHAAS0BwAExAcABNUHAATlBwAE9QcABAYIAAQWCAAEJggABDcIAARHCAAEVwgABGgIAAR4CAAEiQgABJkIAASpCAAEAQoABBEKAAQiCgAE5goABAcLAAQXCwAEJwsABDgLAARICwAE7AsQBIQDEASVAxAEpQMQBLYDEATGAxAEawYQBHwGEASMBhAEnQYQBK0GEAS+BhAEzgYQBN8GEATvBhAEAAcQBBAHEAQhBxAEMQcQBEIHEARSBxAEYwcQBHMHEASEBxAElAcQBKUHEAS1BxAExgcQBNYHEATnBxAE9wcQBAgIEAQYCBAEKQgQBDoIEARKCBAEWwgQBGsIEAR8CBAEjAgQBJ0IEAS+CBAEzggQBN8IEAT3CRAECAoQBBgKEAQpChAE3woQBO8KEAQACxAEEAsQBCELEAQxCxAEQgsQBMYLEATWCyAEZwMgBHgDIASIAyAEmQMgBKkDIAS6AyAEYgYgBHMGIASDBiAElAYgBKQGIAS1BiAExgYgBNYGIATnBiAE9wYgBAgHIAQZByAEKQcgBDoHIARKByAEWwcgBGwHIAR8ByAEjQcgBJ0HIASuByAEvgcgBM8HIATgByAE8AcgBAEIIAQRCCAEIgggBDMIIARDCCAEVAggBGQIIAR1CCAEhgggBLcIIATICCAE2QggBOkIIAT6CCAECgkgBPMJIAQDCiAEFAogBCQKIATbCiAE6wogBPwKIAQNCyAEHQsgBC4LIAQ+CyAEwwswBBsDMAQsAzAEPQMwBE4DMAReAzAEbwMwBIADMASRAzAEcQYwBIIGMASTBjAEpAYwBLQGMATFBjAE1gYwBOcGMAT3BjAECAcwBBkHMAQpBzAEOgcwBEsHMARcBzAEbAcwBH0HMASOBzAEnwcwBK8HMATABzAE0QcwBOIHMATyBzAEAwgwBBQIMAQlCDAENQgwBEYIMARXCDAEaAgwBHgIMASJCDAEuwgwBMwIMATdCDAE7ggwBP4IMAQPCTAEIAkwBOkJMAT5CTAECgowBBsKMAQsCjAEPAowBMIKMATTCjAE5AowBPUKMAQFCzAEFgswBCcLMAS+CzAEzgtABAEDQAQSA0AEIwNABDQDQARFA0AEdwNABIgDQASZA0AEQgRABFMEQARwBkAEgQZABJIGQASjBkAEswZABMQGQATVBkAE5gZABPcGQAQIB0AEGQdABCoHQAQ7B0AETAdABF0HQARtB0AEfgdABI8HQASgB0AEsQdABMIHQATTB0AE5AdABPUHQAQGCEAEFghABCcIQAQ4CEAESQhABFoIQARrCEAEfAhABK8IQAS/CEAE0AhABOEIQATyCEAEAwlABBQJQAQlCUAENglABPAJQAQBCkAEEQpABCIKQAQzCkAERApABLoKQATLCkAE3ApABO0KQAT+CkAEDwtABCALQARTC1AE9wJQBAgDUAQZA1AEKgNQBDsDUASAA1AEkQNQBAgEUAQZBFAEbgZQBIAGUASRBlAEogZQBLMGUATEBlAE1QZQBOYGUAT3BlAECAdQBBkHUAQqB1AEOwdQBEwHUARdB1AEbgdQBH8HUASQB1AEogdQBLMHUATEB1AE1QdQBOYHUAT3B1AECAhQBBkIUAQqCFAEOwhQBEwIUARdCFAEbghQBKEIUASzCFAExAhQBNUIUATmCFAE9whQBAgJUAQZCVAEKglQBDsJUATmCVAE9wlQBAgKUAQZClAEKgpQBDsKUARMClAEXQpQBLIKUATDClAE1QpQBOYKUAT3ClAECAtQBBkLUAQqC2AE7QJgBP8CYAQQA2AEIQNgBDIDYAS8A2AE8ANgBG0GYAR+BmAEjwZgBKEGYASyBmAEwwZgBNQGYATmBmAE9wZgBAgHYAQZB2AEKgdgBDwHYARNB2AEXgdgBG8HYASBB2AEkgdgBKMHYAS0B2AExQdgBNcHYAToB2AE+QdgBAoIYAQcCGAELQhgBD4IYARPCGAEYAhgBHIIYASUCGAEpQhgBLcIYATICGAE2QhgBOoIYAT8CGAEDQlgBB4JYAQvCWAEQAlgBFIJYATKCWAE2wlgBO0JYAT+CWAEDwpgBCAKYAQyCmAEQwpgBFQKYARlCmAEdgpgBIgKYASqCmAEuwpgBM0KYATeCmAE7wpgBAALYAQRC2AEIwtgBDQLYARFC2AEVgtgBGgLcATnAnAE+AJwBAoDcAQbA3AELQNwBHMGcASFBnAElgZwBKgGcAS5BnAEywZwBNwGcATuBnAE/wZwBBEHcAQiB3AENAdwBEUHcARXB3AEaAdwBHoHcASLB3AEnQdwBK4HcAS/B3AE0QdwBOIHcAT0B3AEBQhwBBcIcAQoCHAEOghwBEsIcARdCHAEkQhwBKMIcAS0CHAExghwBNcIcATpCHAE+ghwBAwJcAQdCXAELglwBEAJcARRCXAEuglwBMwJcATdCXAE7wlwBAAKcAQSCnAEIwpwBDUKcARGCnAEWApwBGkKcAR7CnAEjApwBJ0KcASvCnAEwApwBNIKcATjCnAE9QpwBAYLcAQYC3AEKQtwBDsLcARMC3AEXgtwBG8LcASBC3AEkgtwBMcLgASnAoAE3AKABO4CgAQAA4AEEQOABCMDgAQ1A4AEhAaABJUGgASnBoAEuQaABMoGgATcBoAE7gaABP8GgAQRB4AEIgeABDQHgARGB4AEVweABGkHgAR7B4AEjAeABJ4HgASwB4AEwQeABNMHgATlB4AE9geABAgIgAQaCIAEKwiABD0IgAROCIAEYAiABIMIgASVCIAEpwiABLgIgATKCIAE3AiABO0IgAT/CIAENAmABGkJgAR6CYAErwmABMEJgATTCYAE5AmABPYJgAQICoAEGQqABCsKgAQ9CoAETgqABGAKgARyCoAEgwqABJUKgASmCoAEuAqABMoKgATbCoAE7QqABP8KgAQQC4AEIguABDQLgARFC4AEVwuABGkLgAR6C4AEjAuABJ4LgASvC5AEoAKQBMMCkATVApAE5wKQBPkCkAQLA5AEHQOQBC8DkATiA5AE9AOQBIsGkASdBpAErgaQBMAGkATSBpAE5AaQBPYGkAQIB5AEGgeQBCwHkAQ+B5AEUAeQBGIHkARzB5AEhQeQBJcHkASpB5AEuweQBM0HkATfB5AE8QeQBAMIkAQVCJAEJwiQBDgIkARKCJAEgAiQBJIIkASkCJAEtgiQBMgIkATaCJAE7AiQBCEJkARFCZAEVwmQBGkJkAR7CZAEjQmQBJ8JkASxCZAEwwmQBNQJkATmCZAE+AmQBAoKkAQcCpAELgqQBEAKkARSCpAEZAqQBHYKkASICpAEmQqQBKsKkAS9CpAEzwqQBOEKkATzCpAEBQuQBBcLkAQpC5AEOwuQBE0LkAReC5AEcAuQBIILkASUC5AEpguQBLgLoASYAqAEvAKgBM4CoATgAqAE8wKgBAUDoAQXA6AEKQOgBDsDoATfA6AEpAagBLYGoATIBqAE2wagBO0GoAT/BqAEEQegBCMHoAQ1B6AESAegBFoHoARsB6AEfgegBJAHoASjB6AEtQegBMcHoATZB6AE6wegBP0HoAQQCKAEIgigBDQIoARGCKAEWAigBGsIoAR9CKAEjwigBKEIoASzCKAExQigBNgIoATqCKAEDgmgBCAJoAQzCaAERQmgBFcJoARpCaAEewmgBI0JoASgCaAEsgmgBMQJoATWCaAE6AmgBPsJoAQNCqAEHwqgBDEKoARDCqAEVQqgBGgKoAR6CqAEjAqgBJ4KoASwCqAEwwqgBNUKoATnCqAE+QqgBAsLoAQdC6AEMAugBEILoARUC6AEZgugBHgLoASLC6AEnQugBK8LoATBC7AEogKwBLQCsATHArAE2QKwBOwCsAT+ArAEEQOwBCMDsAQ2A7AESAOwBFoDsARtA7AEfwOwBLcDsATJA7AErAawBL4GsATRBrAE4wawBPYGsAQIB7AEGgewBC0HsAQ/B7AEUgewBGQHsAR3B7AEiQewBJwHsASuB7AEwQewBNMHsATmB7AE+AewBAoIsAQdCLAELwiwBEIIsARUCLAEZwiwBHkIsASMCLAEngiwBLEIsATDCLAE1giwBOgIsAQNCbAEHwmwBDIJsARECbAEVwmwBGkJsAR8CbAEjgmwBKEJsASzCbAExgmwBNgJsATqCbAE/QmwBA8KsAQiCrAENAqwBEcKsARZCrAEbAqwBH4KsASRCrAEowqwBLYKsATICrAE2gqwBO0KsAT/CrAEEguwBCQLsAQ3C7AESQuwBFwLsARuC7AEgQuwBJMLsASmC7AEuAvABIcCwASaAsAErALABL8CwATSAsAE5QLABPcCwAQKA8AEHQPABDADwARCA8AEVQPABGgDwAR7A8AEjQPABKADwASzA8AExgPABNgDwAS0BsAExgbABNkGwATsBsAE/wbABBEHwAQkB8AENwfABEoHwARcB8AEbwfABIIHwASVB8AE4AfABPIHwARjCMAEdgjABIgIwASbCMAErgjABMEIwATTCMAE5gjABPkIwAQMCcAEHgnABDEJwARECcAEVwnABGkJwAR8CcAEjwnABKIJwAS0CcAExwnABNoJwATtCcAE/wnABBIKwAQlCsAEOArABEoKwARdCsAEcArABIMKwASVCsAEqArABLsKwATOCsAE4ArABPMKwAQGC8AEGQvABCsLwAQ+C8AEUQvABGQLwAR2C8AEiQvABJwLwASvC8AEwQvABB8M0ASBAtAElQLQBKgC0AS7AtAEzgLQBOEC0AT0AtAECAPQBBsD0AQuA9AEQQPQBFQD0ARnA9AEegPQBI4D0AShA9AEtAPQBMcD0ATaA9AE7QPQBLIG0ATFBtAE2AbQBOsG0AT+BtAEEgfQBCUH0AQ4B9AESwfQBF4H0ARxB9AEagjQBH0I0ASRCNAEpAjQBLcI0ATKCNAE3QjQBPAI0AQDCdAEFwnQBCoJ0AQ9CdAEUAnQBGMJ0AR2CdAEiQnQBJ0J0ASwCdAEwwnQBNYJ0ATpCdAE/AnQBBAK0AQjCtAENgrQBEkK0ARcCtAEbwrQBIIK0ASWCtAEqQrQBLwK0ATPCtAE4grQBPUK0AQIC9AEHAvQBC8L0ARCC9AEVQvQBGgL0AR7C9AEjwvQBKIL0AS1C9AEKAzQBDsM4ARSAuAEZQLgBHgC4ASMAuAEnwLgBLMC4ATGAuAE2gLgBO0C4AQBA+AEFAPgBCgD4AQ7A+AETgPgBGID4AR1A+AEiQPgBJwD4ASwA+AEwwPgBNcD4ATqA+AE/gPgBM4G4AThBuAE9QbgBAgH4AQbB+AELwfgBEIH4ARWB+AEaQfgBFMI4AR6COAEjQjgBKEI4AS0COAEyAjgBNsI4ATuCOAEAgngBBUJ4AQpCeAEPAngBFAJ4ARjCeAEdwngBIoJ4ASeCeAEsQngBMUJ4ATYCeAE6wngBP8J4AQSCuAEJgrgBDkK4ARNCuAEYArgBHQK4ASHCuAEmwrgBK4K4ATCCuAE1QrgBOgK4AT8CuAEDwvgBCML4AQ2C+AESgvgBF0L4ARxC+AEhAvgBJgL4ASrC+AE+QvgBDMM4ARHDOAEWgzgBG4M8ARLAvAEXwLwBHMC8ASGAvAEmgLwBK4C8ATCAvAE1gLwBOoC8AT+AvAEEgPwBCYD8AQ5A/AETQPwBGED8AR1A/AEiQPwBJ0D8ASxA/AExQPwBNkD8ATsA/AEAATwBMwG8AQcB/AEMAfwBEQH8ARYB/AEawfwBDII8ARaCPAEggjwBJYI8ASqCPAEvgjwBNEI8ATlCPAE+QjwBA0J8AQhCfAENQnwBEkJ8ARdCfAEcQnwBIQJ8ASYCfAErAnwBMAJ8ATUCfAE6AnwBPwJ8AQQCvAEJArwBDcK8ARLCvAEXwrwBHMK8ASHCvAEmwrwBK8K8ATDCvAE1wrwBOoK8AT+CvAEEgvwBCYL8AQ6C/AETgvwBGIL8AR2C/AEigvwBJ0L8ASxC/AEAQzwBBUM8ARkDPAEeAwABUQCAAVYAgAFbAIABYECAAWVAgAFqQIABb4CAAXSAgAF5gIABfsCAAUPAwAFIwMABTgDAAVMAwAFYAMABXUDAAWJAwAFnQMABbIDAAXGAwAF2gMABe8DAAUDBAAFtwYABcsGAAXfBgAF9AYABZYHAAXoBwAFJQgABTkIAAVNCAAFYggABXYIAAWKCAAFnwgABbMIAAXHCAAF3AgABfAIAAUtCQAFQQkABVYJAAVqCQAFfwkABZMJAAWnCQAFvAkABdAJAAXkCQAF+QkABQ0KAAUhCgAFNgoABUoKAAVeCgAFcwoABYcKAAWbCgAFsAoABcQKAAXYCgAF7QoABQELAAUVCwAFKgsABT4LAAVSCwAFZwsABXsLAAWPCwAFpAsABfULAAUJDAAFgwwQBTwCEAVRAhAFZgIQBXsCEAWPAhAFpAIQBbkCEAXOAhAF4wIQBfgCEAUMAxAFIQMQBTYDEAVLAxAFYAMQBXQDEAWJAxAFngMQBbMDEAXIAxAF3AMQBfEDEAUGBBAFGwQQBbUGEAXKBhAF3gYQBfMGEAWuBxAF2AcQBe0HEAUXCBAFKwgQBUAIEAVVCBAFaggQBX8IEAWTCBAFqAgQBb0IEAXSCBAF5wgQBSUJEAU6CRAFTwkQBWMJEAV4CRAFjQkQBaIJEAW3CRAFzAkQBeAJEAX1CRAFCgoQBR8KEAU0ChAFSAoQBV0KEAVyChAFhwoQBZwKEAWwChAFxQoQBdoKEAXvChAFBAsQBRgLEAUtCxAFQgsQBVcLEAVsCxAFgQsQBZULEAWqCxAF1AsQBf0LEAWPDCAFNAIgBUoCIAVfAiAFdAIgBYoCIAWfAiAFtAIgBcoCIAXfAiAF9AIgBQoDIAUfAyAFNAMgBUkDIAVfAyAFdAMgBYkDIAWfAyAFtAMgBckDIAXfAyAF9AMgBQkEIAUeBCAFswYgBcgGIAXdBiAF8wYgBQgHIAWdByAF3QcgBfIHIAUICCAFHQggBUgIIAVdCCAFcgggBbIIIAXHCCAF3QggBfIIIAUyCSAFRwkgBVwJIAVyCSAFhwkgBZwJIAWyCSAFxwkgBdwJIAXyCSAFBwogBRwKIAUxCiAFRwogBVwKIAVxCiAFhwogBZwKIAWxCiAFxwogBdwKIAXxCiAFBgsgBRwLIAUxCyAFRgsgBVwLIAVxCyAFhgsgBZwLIAWxCyAFxgsgBdwLIAXxCyAFBgwgBYYMMAUsAjAFQgIwBVgCMAVuAjAFhAIwBZkCMAWvAjAFxQIwBdsCMAXxAjAFBwMwBRwDMAUyAzAFSAMwBV4DMAV0AzAFiQMwBZ8DMAW1AzAFywMwBeEDMAX3AzAFDAQwBSIEMAU4BDAFsQYwBccGMAXcBjAF8gYwBQgHMAUeBzAFdQcwBYsHMAXMBzAF4gcwBfgHMAUOCDAFpwgwBbwIMAXSCDAFKQkwBT8JMAVVCTAFawkwBYEJMAWXCTAFrAkwBcIJMAXYCTAF7gkwBQQKMAUZCjAFLwowBUUKMAVbCjAFcQowBYcKMAWcCjAFsgowBcgKMAXeCjAF9AowBQkLMAUfCzAFNQswBUsLMAVhCzAFdwswBYwLMAWiCzAFuAswBc4LMAXkCzAF+QswBQ8MMAUlDDAFkgxABToCQAVRAkAFZwJABX0CQAWUAkAFqgJABcACQAXXAkAF7QJABQMDQAUaA0AFMANABUcDQAVdA0AFcwNABYoDQAWgA0AFtgNABc0DQAXjA0AF+QNABRAEQAUmBEAFPARABVMEQAWABEAFCAdABR4HQAU1B0AFSwdABWEHQAV4B0AFpQdABbsHQAXRB0AF6AdABf4HQAUUCEAFmghABbEIQAXHCEAFCglABSEJQAU3CUAFTQlABWQJQAV6CUAFkAlABacJQAW9CUAF1AlABeoJQAUACkAFFwpABS0KQAVDCkAFWgpABXAKQAWGCkAFnQpABbMKQAXJCkAF4ApABfYKQAUNC0AFIwtABTkLQAVQC0AFZgtABXwLQAWTC0AFqQtABb8LQAXWC0AF7AtABQMMQAUZDEAFLwxABUYMQAWfDFAFNQJQBUwCUAVkAlAFewJQBZICUAWpAlAFwAJQBdcCUAXuAlAFBQNQBRwDUAUzA1AFSgNQBWEDUAV4A1AFkANQBacDUAW+A1AF1QNQBewDUAUDBFAFGgRQBTEEUAVIBFAFXwRQBXYEUAWkBFAF/AZQBRQHUAUrB1AFQgdQBVkHUAVwB1AFhwdQBZ4HUAW1B1AFzAdQBeMHUAX6B1AFEQhQBSgIUAVXCFAFhQhQBZwIUAWzCFAFyghQBeEIUAUmCVAFPQlQBVQJUAVsCVAFgwlQBZoJUAWxCVAFyAlQBd8JUAX2CVAFDQpQBSQKUAU7ClAFUgpQBWkKUAWAClAFmApQBa8KUAXGClAF3QpQBfQKUAULC1AFIgtQBTkLUAVQC1AFZwtQBX4LUAWVC1AFrAtQBcQLUAXbC1AF8gtQBQkMUAUgDFAFNwxQBU4MUAVlDGAFLQJgBUQCYAVcAmAFdAJgBYsCYAWjAmAFuwJgBdICYAXqAmAFAgNgBRkDYAUxA2AFSQNgBWADYAV4A2AFkANgBagDYAW/A2AF1wNgBe8DYAUGBGAFHgRgBTYEYAVlBGAFfQRgBcQEYAXbBGAF8wRgBfwGYAUUB2AFLAdgBUMHYAVbB2AFcwdgBYoHYAWiB2AFugdgBdEHYAXpB2AFAQhgBRgIYAUwCGAFSAhgBV8IYAV3CGAFjwhgBaYIYAW+CGAF1ghgBe4IYAUFCWAFHQlgBTUJYAVMCWAFZAlgBXwJYAWTCWAFqwlgBcMJYAXaCWAF8glgBQoKYAUhCmAFOQpgBVEKYAVoCmAFgApgBZgKYAWwCmAFxwpgBd8KYAX3CmAFDgtgBSYLYAU+C2AFVQtgBW0LYAWFC2AFnAtgBbQLYAXMC2AF4wtgBfsLYAUTDGAFKgxgBUIMYAVaDGAFcgxwBScCcAVAAnAFWAJwBXACcAWJAnAFoQJwBboCcAXSAnAF6wJwBQMDcAUcA3AFNANwBU0DcAVlA3AFfgNwBZYDcAWvA3AFxwNwBeADcAX4A3AFEQRwBSkEcAVCBHAFWgRwBdUEcAXtBHAFCAdwBSAHcAU5B3AFUQdwBWoHcAWCB3AFmwdwBbMHcAXMB3AF5AdwBf0HcAUVCHAFLghwBUYIcAVfCHAFdwhwBZAIcAWoCHAFwQhwBdkIcAXyCHAFCglwBSMJcAU7CXAFVAlwBWwJcAWFCXAFnQlwBbYJcAXOCXAF5wlwBf8JcAUYCnAFMApwBUkKcAVhCnAFegpwBZIKcAWrCnAFwwpwBdwKcAX0CnAFDQtwBSULcAU+C3AFVgtwBW8LcAWHC3AFoAtwBbgLcAXQC3AF6QtwBQEMcAUaDHAFMgxwBUsMcAVjDHAFfAxwBZQMcAWtDIAFIQKABToCgAVUAoAFbQKABYYCgAWgAoAFuQKABdMCgAXsAoAFBQOABR8DgAU4A4AFUQOABWsDgAWEA4AFnQOABbcDgAXQA4AF6QOABQMEgAUcBIAFNQSABU8EgAVoBIAFggSABZsEgAW0BIAFzgSABeIGgAX7BoAFLgeABUcHgAVhB4AFegeABZMHgAWtB4AFxgeABd8HgAX5B4AFEgiABSwIgAVFCIAFXgiABXgIgAWRCIAFqgiABcQIgAXdCIAF9giABRAJgAUpCYAFQgmABVwJgAV1CYAFjgmABagJgAXBCYAF2wmABfQJgAUNCoAFJwqABUAKgAVZCoAFcwqABYwKgAWlCoAFvwqABdgKgAXxCoAFCwuABSQLgAU9C4AFVwuABXALgAWKC4AFowuABbwLgAXWC4AF7wuABQgMgAUiDIAFOwyABVQMgAVuDIAFoAyQBRsCkAU1ApAFTwKQBWoCkAWEApAFngKQBbgCkAXTApAF7QKQBQcDkAUhA5AFPAOQBVYDkAVwA5AFiwOQBaUDkAW/A5AFDgSQBSgEkAVDBJAFXQSQBXcEkAWRBJAFrASQBcYEkAW5BpAF7gaQBQgHkAU9B5AFVweQBXEHkAWLB5AFpgeQBcAHkAXaB5AF9AeQBQ8IkAUpCJAFQwiQBV4IkAV4CJAFkgiQBawIkAXHCJAF4QiQBfsIkAUWCZAFMAmQBUoJkAVkCZAFfwmQBZkJkAWzCZAFzQmQBegJkAUCCpAFHAqQBTcKkAVRCpAFawqQBYUKkAWgCpAFugqQBdQKkAXvCpAFCQuQBSMLkAU9C5AFWAuQBXILkAWMC5AFpguQBcELkAXbC5AF9QuQBRAMkAUqDJAFRAyQBV4MkAV5DJAFkwyQBTENoAXdAaAF+QGgBRQCoAUvAqAFSgKgBWYCoAWBAqAFnAKgBbcCoAXTAqAF7gKgBQkDoAUlA6AFQAOgBVsDoAV2A6AFkgOgBa0DoAXIA6AF/wOgBRoEoAU1BKAFUQSgBWwEoAWHBKAFogSgBb4EoAXEBqAF+gagBWcHoAWDB6AFngegBbkHoAXVB6AF8AegBQsIoAUmCKAFQgigBV0IoAV4CKAFkwigBa8IoAXKCKAF5QigBQEJoAUcCaAFNwmgBVIJoAVuCaAFiQmgBaQJoAW/CaAF2wmgBfYJoAURCqAFLQqgBUgKoAVjCqAFfgqgBZoKoAW1CqAF0AqgBesKoAUHC6AFIgugBT0LoAVZC6AFdAugBY8LoAWqC6AFxgugBeELoAX8C6AFFwygBTMMoAVODKAFKA2gBUMNsAW4ALAF8AGwBQwCsAUpArAFRQKwBWECsAV+ArAFmgKwBbYCsAXTArAF7wKwBQwDsAUoA7AFRAOwBWEDsAV9A7AFmQOwBQsEsAUnBLAFQwSwBWAEsAV8BLAFmASwBewGsAVdB7AFeQewBZYHsAXrB7AFBwiwBSMIsAVACLAFXAiwBXkIsAWVCLAFsQiwBc4IsAXqCLAFBgmwBSMJsAU/CbAFWwmwBXgJsAWUCbAFsAmwBc0JsAXpCbAFBQqwBSIKsAU+CrAFWgqwBXcKsAWTCrAFrwqwBcwKsAXoCrAFBAuwBSELsAU9C7AFWguwBXYLsAWSC7AFrwuwBcsLsAXnC7AFBAywBSAMsAU8DLAFWQywBR8NsAU7DbAFWA3ABd0AwAXnAcAFBALABSICwAU/AsAFXQLABXoCwAWYAsAFtQLABdMCwAXwAsAFDgPABSsDwAVJA8AFZgPABRgEwAU1BMAFUwTABXAEwAWOBMAF3AbABW8HwAWNB8AFqgfABeUHwAUDCMAFIAjABT4IwAVbCMAFeQjABZYIwAW0CMAF0QjABe8IwAUMCcAFKgnABUcJwAVlCcAFggnABaAJwAW9CcAF2wnABfgJwAUWCsAFMwrABVEKwAVuCsAFjArABaoKwAXHCsAF5QrABQILwAUgC8AFPQvABVsLwAV4C8AFlgvABbMLwAXRC8AF7gvABQwMwAUpDMAFRwzABWQMwAUzDcAFUA3QBcgA0AXnANAFBgHQBb4B0AXdAdAF/AHQBRoC0AU5AtAFWALQBXcC0AWWAtAFtALQBdMC0AXyAtAFEQPQBS8D0AVOA9AFBwTQBSYE0AVEBNAFggTQBUYH0AWDB9AFogfQBf4H0AUdCNAFPAjQBVoI0AV5CNAFmAjQBbcI0AXWCNAF9AjQBRMJ0AUyCdAFUQnQBW8J0AWOCdAFrQnQBcwJ0AXqCdAFCQrQBSgK0AVHCtAFZgrQBYQK0AWjCtAFwgrQBeEK0AX/CtAFHgvQBT0L0AVcC9AFegvQBZkL0AW4C9AF1wvQBfYL0AUUDNAFMwzQBVIM0AVxDNAFjwzQBUgN4AWyAOAF0wDgBfMA4AUUAeAFNAHgBXUB4AWVAeAFtgHgBdYB4AX3AeAFFwLgBTgC4AVYAuAFeALgBZkC4AW5AuAF2gLgBfoC4AUbA+AFOwPgBR4E4AU+BOAFQgXgBUkH4AVpB+AFigfgBaoH4AXrB+AFCwjgBSwI4AVMCOAFbQjgBY0I4AWuCOAFzgjgBe4I4AUPCeAFLwngBVAJ4AVwCeAFkQngBbEJ4AXSCeAF8gngBRIK4AUzCuAFUwrgBXQK4AWUCuAFtQrgBdUK4AX1CuAFFgvgBTYL4AVXC+AFdwvgBZgL4AW4C+AF2AvgBfkL4AUZDOAFOgzgBVoM4AV7DOAFmwzgBbsM4AXcDOAF/AzgBV4N4AV+DfAFmQDwBbsA8AXdAPAF/wDwBSEB8AVDAfAFZQHwBYcB8AWpAfAFygHwBewB8AUOAvAFMALwBVIC8AV0AvAFlgLwBbgC8AXaAvAF/ALwBR4D8AVAA/AFYgPwBeoD8AUMBPAFLgTwBXIE8AUcBfAFPgXwBTsH8AVdB/AFfwfwBaEH8AXlB/AFBwjwBSkI8AVLCPAFbQjwBY8I8AWxCPAF0gjwBfQI8AUWCfAFOAnwBVoJ8AV8CfAFngnwBcAJ8AXiCfAFBArwBSYK8AVICvAFagrwBYwK8AWuCvAF0ArwBfIK8AUUC/AFNgvwBVgL8AV6C/AFnAvwBb4L8AXgC/AFAgzwBSQM8AVGDPAFZwzwBYkM8AWrDPAFzQzwBe8M8AURDfAFMw3wBVUN8AV3DfAFmQ3wBbsN8AXdDQAGWgAABsYAAAbqAAAGDgEABjIBAAZWAQAGegEABp4BAAbCAQAG5gEABgoCAAYuAgAGUgIABnYCAAaaAgAGvgIABuICAAYGAwAGKgMABk4DAAZyAwAGugMABt4DAAZKBAAGbgQABiIFAAZGBQAGagUABmIHAAaGBwAGqgcABvIHAAYWCAAGOggABl4IAAaCCAAGpggABsoIAAbuCAAGEgkABjYJAAZaCQAGfgkABqIJAAbGCQAG6gkABg4KAAYyCgAGVgoABnoKAAaeCgAGwgoABuYKAAYKCwAGLgsABlILAAZ2CwAGmgsABr4LAAbiCwAGBgwABioMAAZODAAGcgwABpYMAAa6DAAG3gwABgINAAYmDQAGSg0ABm4NAAaSDQAGtg0ABtoNAAb+DRAGOQAQBoYAEAasABAG0wAQBvkAEAYfARAGRgEQBmwBEAaSARAGuAEQBt8BEAYFAhAGKwIQBlICEAZ4AhAGngIQBsUCEAbrAhAGEQMQBjcDEAZeAxAGhAMQBh0EEAZDBBAGAwUQBikFEAZQBRAGdgUQBjUGEAZcBhAGjgcQBrQHEAbbBxAGJwgQBk4IEAaaCBAGwAgQBucIEAYNCRAGMwkQBloJEAaACRAGpgkQBs0JEAbzCRAGGQoQBj8KEAZmChAGjAoQBrIKEAbZChAG/woQBiULEAZLCxAGcgsQBpgLEAa+CxAG5QsQBgsMEAYxDBAGWAwQBn4MEAakDBAGygwQBvEMEAYXDRAGPQ0QBmQNEAaKDRAGsA0QBtcNEAb9DSAGFAAgBj0AIAa2ACAG3gAgBgcBIAYvASAGWAEgBoABIAapASAG0QEgBvoBIAYiAiAGSwIgBnMCIAabAiAGxAIgBuwCIAYVAyAGPQMgBmYDIAaOAyAGtwMgBjAEIAZYBCAGgQQgBvoEIAYjBSAGSwUgBnQFIAacBSAGqgcgBtIHIAb7ByAGIwggBkwIIAZ0CCAGnAggBsUIIAbtCCAGFgkgBj4JIAZnCSAGjwkgBrgJIAYJCiAGMQogBlkKIAaCCiAGqgogBtMKIAb7CiAGJAsgBkwLIAZ1CyAGnQsgBsULIAbuCyAGFgwgBj8MIAZnDCAGkAwgBrgMIAbhDCAGCQ0gBjINIAZaDSAGgg0gBqsNIAbTDSAG/A0wBpgAMAbDADAG7wAwBhoBMAZFATAGcQEwBpwBMAbHATAG8wEwBh4CMAZKAjAGdQIwBswCMAZ5AzAG0AMwBicEMAZSBDAGAAUwBisFMAZWBTAGggUwBq0FMAbYBTAGtQcwBuEHMAYMCDAGOAgwBmMIMAYQCTAGPAkwBmcJMAaTCTAGvgkwBhUKMAZACjAGawowBpcKMAbCCjAG7gowBhkLMAZECzAGcAswBpsLMAbGCzAG8gswBh0MMAZJDDAGdAwwBp8MMAbLDDAG9gwwBiENMAZNDTAGeA0wBqQNMAbPDTAG+g1ABtIAQAYBAUAGMAFABusBQAZ3AkAGpgJABtUCQAYDA0AGMgNABmEDQAa+A0AG7QNABhwEQAZLBEAGBgVABjQFQAZjBUAGkgVABsEFQAbvBUAGHgZABvIHQAYhCEAGxQlABvQJQAYjCkAGUgpABoAKQAavCkAG3gpABg0LQAY7C0AGagtABpkLQAbIC0AG9gtABiUMQAZUDEAGgwxABrEMQAbgDEAGDw1ABj4NUAZHAlAGegJQBq0CUAbfAlAGqgNQBt0DUAYPBFAGDQVQBkAFUAZyBVAGpQVQBtgFUAYKBlAGzglQBjMKUAZmClAGmQpQBssKUAb+ClAGMQtQBmMLUAaWC1AGyQtQBvwLUAaUDFAGxgxgBkYCYAbsAmAGIwNgBloDYAaSA2AGyQNgBgEEYAbeBGAGFgVgBk0FYAaEBWAGvAVgBvMFYAYyCWAGRwpgBn4KYAa2CmAG7QpgBiQLYAZcC2AGkwtgBgIMcAZ1A3AGsgNwBuMEcAYgBXAGXQVwBpoFcAbXBXAGFAZwBpsKcAbYCnAGFQtwBlILgAaFAoAGyQKABlEDgAbZA4AGYQSABqUEgAbpBIAGLQWABnAFgAa0BYAG+AWABq8JgAYDC4AGRwuQBr0DkAZXBJAGowSQBvAEkAY8BZAGiQWQBtYFkAYiBpAGoQeQBu4HkAbsCqAGmgOgBvIDoAahBKAG+QSgBlEFoAapBaAGAQagBrgHoAbOCrAGhAOwBu4DsAZYBLAGwgSwBiwFsAaVBbAG/wWwBmkGwAZFBMAGRgXABscF"), u16 = new Uint16Array(raw.length / 2);
  for (let i = 0; i < u16.length; i++) u16[i] = raw.charCodeAt(i * 2) | (raw.charCodeAt(i * 2 + 1) << 8);
  const xyz = (la, lo, r = 1) => [Math.cos(la * D) * Math.sin(lo * D) * r, -Math.sin(la * D) * r, Math.cos(la * D) * Math.cos(lo * D) * r];
  const LL = [];
  for (let i = 0; i < u16.length; i += 2) LL.push([u16[i] / 10 - 90, u16[i + 1] / 10 - 180]);
  const land = new Float32Array(LL.length * 3);
  LL.forEach(([la, lo], i) => land.set(xyz(la, lo), i * 3));
  // scan style: merge each latitude row into runs
  const rows = new Map();
  LL.forEach(([la, lo]) => { if (!rows.has(la)) rows.set(la, []); rows.get(la).push(lo); });
  const runs = [];
  rows.forEach((los, la) => {
    los.sort((a, b) => a - b);
    const step = 1.6 / Math.max(0.2, Math.cos(la * D)) * 1.6;
    let a = los[0], b = los[0];
    const push = () => { const n = Math.max(2, Math.ceil((b - a) / 2) + 1), pts = new Float32Array(n * 3); for (let k = 0; k < n; k++) pts.set(xyz(la, a - 0.6 + (b - a + 1.2) * k / (n - 1)), k * 3); runs.push(pts); };
    for (let k = 1; k < los.length; k++) { if (los[k] - b > step) { push(); a = los[k]; } b = los[k]; }
    push();
  });
  // graticule
  const grat = [];
  for (let la = -60; la <= 60; la += 30) { const pts = new Float32Array(73 * 3); for (let k = 0; k <= 72; k++) pts.set(xyz(la, k * 5 - 180), k * 3); grat.push(pts); }
  for (let lo = -180; lo < 180; lo += 30) { const pts = new Float32Array(37 * 3); for (let k = 0; k <= 36; k++) pts.set(xyz(k * 5 - 90, lo), k * 3); grat.push(pts); }

  // the trace
  const HOPS = [["reykjavik", 64.1, -21.9], ["london", 51.5, -0.1], ["warsaw", 52.2, 21], ["istanbul", 41, 28.9], ["tehran", 35.7, 51.4], ["karachi", 24.9, 67], ["colombo", 6.9, 79.9], ["riyadh", 24.7, 46.7]];
  const MS = [1, 9, 18, 24, 41, 57, 63, 76];
  const hopP = HOPS.map(h => xyz(h[1], h[2], 1.01));
  const RS = 24, route = new Float32Array((HOPS.length - 1) * RS * 3 + 3);
  for (let h = 0; h < HOPS.length - 1; h++) {
    const a = hopP[h], b = hopP[h + 1], om = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))), so = Math.sin(om) || 1;
    for (let s = h ? 1 : 0; s <= RS; s++) {
      const t = s / RS, ka = Math.sin((1 - t) * om) / so, kb = Math.sin(t * om) / so, r = 1.01 + Math.sin(t * Math.PI) * om * 0.22;
      route.set([(a[0] * ka + b[0] * kb) * r, (a[1] * ka + b[1] * kb) * r, (a[2] * ka + b[2] * kb) * r], (h * RS + s) * 3);
    }
  }

  // who's looking: /cdn-cgi/trace is answered by cloudflare's edge on this origin. nothing leaves the
  // browser except that same-origin request, and the result is only drawn on this screen
  let you = "...";
  fetch("/cdn-cgi/trace", { cache: "no-store" })
    .then(r => r.ok ? r.text() : "")
    .then(t => {
      const kv = Object.fromEntries(t.split("\n").filter(l => l.includes("=")).map(l => l.split("=")));
      you = kv.ip ? kv.ip + (kv.loc ? " (" + kv.loc.toLowerCase() + ")" : "") : "local";
    })
    .catch(() => { you = "local"; })
    .finally(() => { dirty = true; wake(); });

  // view
  let M = [1, 0, 0, 0, 1, 0, 0, 0, 1], vx = 0, vy = 0, zoom = 1, drag = null, dirty = true, style = "dots";
  const rotate = (ax, ay) => {
    const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
    const R = [cb, 0, sb, -sa * sb, ca, sa * cb, -ca * sb, -sa, ca * cb];
    const o = new Array(9);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = R[r * 3] * M[c] + R[r * 3 + 1] * M[3 + c] + R[r * 3 + 2] * M[6 + c];
    M = o; dirty = true;
  };
  rotate(0, -40 * D); rotate(36 * D, 0); // face the route

  let W = 0, H = 0, dpr = 1, R = 1, cx = 0, cy = 0;
  const size = () => {
    dpr = Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    for (const c of [cv, fx]) { c.width = W * dpr; c.height = H * dpr; }
    dirty = true;
  };
  const projArr = (src, out) => {
    const F = 4;
    for (let o = 0; o < src.length; o += 3) {
      const x = src[o], y = src[o + 1], z = src[o + 2];
      const X = M[0] * x + M[1] * y + M[2] * z, Y = M[3] * x + M[4] * y + M[5] * z, Z = M[6] * x + M[7] * y + M[8] * z, k = F / (F - Z);
      out[o] = cx + X * R * k; out[o + 1] = cy + Y * R * k; out[o + 2] = Z;
    }
    return out;
  };
  const landS = new Float32Array(land.length), runS = runs.map(r => new Float32Array(r.length)), gratS = grat.map(r => new Float32Array(r.length));
  const routeS = new Float32Array(route.length), hopS = new Float32Array(hopP.length * 3);
  const hopFlat = new Float32Array(hopP.flat());

  const RAMP = " .:-=+*#%@";
  const line = (a, front) => {
    g.beginPath();
    let on = false;
    for (let o = 0; o < a.length; o += 3) {
      const vis = front ? a[o + 2] > 0 : a[o + 2] <= 0;
      if (vis) { on ? g.lineTo(a[o], a[o + 1]) : g.moveTo(a[o], a[o + 1]); on = true; } else on = false;
    }
  };
  // arcs above the surface are hidden only when they pass behind the disc
  const hidden = (a, o) => a[o + 2] < 0 && Math.hypot(a[o] - cx, a[o + 1] - cy) < R * 0.995;

  const scene = () => {
    const A = 1;
    // graticule
    g.lineWidth = 1;
    gratS.forEach(a => {
      line(a, true); g.strokeStyle = "rgba(0,255,200,.09)"; g.stroke();
    });
    const n = landS.length / 3, cell = R * 0.028;
    if (style === "dots") {
      for (let i = 0; i < n; i++) {
        const z = landS[i * 3 + 2]; if (z <= 0) continue;
        const s = cell * (0.16 + z * 0.2);
        g.fillStyle = "rgba(" + (z > 0.93 ? "190,255,240" : "0,255,200") + "," + (A * (0.3 + z * 0.7)).toFixed(2) + ")";
        g.beginPath(); g.arc(landS[i * 3], landS[i * 3 + 1], s, 0, 7); g.fill();
      }
      g.fillStyle = "rgba(0,255,200,.06)";
      for (let i = 0; i < n; i++) { if (landS[i * 3 + 2] > 0) continue; g.fillRect(landS[i * 3] - 0.8, landS[i * 3 + 1] - 0.8, 1.6, 1.6); }
    } else if (style === "scan") {
      g.lineCap = "butt";
      runS.forEach(a => {
        const z = a[(a.length / 6 | 0) * 3 + 2];
        line(a, true); g.strokeStyle = "rgba(60,255,142," + (0.25 + Math.max(0, z) * 0.75).toFixed(2) + ")"; g.lineWidth = cell * 0.42; g.stroke();
      });
    } else if (style === "ascii") {
      g.font = Math.max(7, cell * 1.25).toFixed(1) + "px VGA, monospace"; g.textAlign = "center"; g.textBaseline = "middle";
      for (let i = 0; i < n; i++) {
        const z = landS[i * 3 + 2]; if (z <= 0.04) continue;
        const ch = RAMP[Math.min(9, 1 + (z * 9) | 0)];
        g.fillStyle = z > 0.8 ? "rgba(200,255,220," + A + ")" : "rgba(60,255,142," + (A * (0.3 + z * 0.7)).toFixed(2) + ")";
        g.fillText(ch, landS[i * 3], landS[i * 3 + 1]);
      }
    }
  };

  const draw = () => {
    R = Math.min(W, H) * (W < 700 ? 0.44 : 0.4) * zoom; cx = W / 2; cy = H / 2 + (W < 700 ? -10 : 0);
    projArr(land, landS); runs.forEach((r, i) => projArr(r, runS[i])); grat.forEach((r, i) => projArr(r, gratS[i]));
    projArr(route, routeS); projArr(hopFlat, hopS);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    g.lineCap = "round"; g.lineJoin = "round";
    // body + atmosphere
    const body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, style === "scan" || style === "ascii" ? "rgba(8,40,22,.55)" : "rgba(0,44,40,.55)"); body.addColorStop(1, "rgba(0,8,8,.85)");
    g.fillStyle = body; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    const atm = g.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.18);
    atm.addColorStop(0, "rgba(0,255,200,.28)"); atm.addColorStop(0.25, "rgba(0,255,200,.08)"); atm.addColorStop(1, "rgba(0,255,200,0)");
    g.fillStyle = atm; g.beginPath(); g.arc(cx, cy, R * 1.18, 0, 7); g.fill();
    g.strokeStyle = "rgba(0,255,200,.5)"; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    scene();
    // HUD frame: corner brackets around the globe and tick ring
    const b = Math.min(R * 1.2, H / 2 - 14, W / 2 - 14), l = 18;
    g.strokeStyle = "rgba(0,255,200,.55)"; g.lineWidth = 1; g.beginPath();
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.moveTo(cx + sx * b, cy + sy * (b - l)); g.lineTo(cx + sx * b, cy + sy * b); g.lineTo(cx + sx * (b - l), cy + sy * b); }
    g.stroke();
    g.strokeStyle = "rgba(0,255,200,.22)"; g.beginPath();
    for (let k = 0; k < 120; k++) { const a = k / 120 * Math.PI * 2, r0 = R * 1.1, r1 = r0 + (k % 10 ? 4 : 10); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); }
    g.stroke();
    // route
    const seg = (w, col, front) => {
      g.beginPath(); let on = false;
      for (let o = 0; o < routeS.length; o += 3) {
        const vis = hidden(routeS, o) !== front;
        if (vis) { on ? g.lineTo(routeS[o], routeS[o + 1]) : g.moveTo(routeS[o], routeS[o + 1]); on = true; } else on = false;
      }
      g.strokeStyle = col; g.lineWidth = w; g.stroke();
    };
    seg(1.2, "rgba(255,43,214,.25)", false);
    seg(9, "rgba(255,43,214,.18)", true); seg(4, "rgba(255,43,214,.45)", true); seg(1.8, "#ffd6f5", true);
    hopP.forEach((p, k) => {
      const x = hopS[k * 3], y = hopS[k * 3 + 1], back = hidden(hopS, k * 3), dst = k === hopP.length - 1, sel = k === hop;
      g.globalAlpha = back ? 0.2 : 1;
      if (dst) { g.fillStyle = "#ff2bd6"; g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, sel ? 8 : 6, 0, 7); g.fill(); g.stroke(); }
      else { g.fillStyle = sel ? "#ff2bd6" : "#e8fff8"; g.fillRect(x - (sel ? 5 : 3.5), y - (sel ? 5 : 3.5), sel ? 10 : 7, sel ? 10 : 7); }
      g.globalAlpha = 1;
      if (sel) {
        const bb = 15, ll = 6; g.strokeStyle = "#ff2bd6"; g.lineWidth = 1.2; g.beginPath();
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.moveTo(x + sx * bb, y + sy * (bb - ll)); g.lineTo(x + sx * bb, y + sy * bb); g.lineTo(x + sx * (bb - ll), y + sy * bb); }
        g.stroke();
      }
    });
    // what's facing you
    const la = Math.asin(Math.max(-1, Math.min(1, M[7]))) / D, lo = Math.atan2(-M[6], M[8]) / D;
    meta.textContent = "you " + you + " · lat " + (-la).toFixed(1) + " · lon " + (-lo).toFixed(1) + " · " + style;
    if (hop >= 0) placeTip();
    dirty = false;
  };

  // hover a hop: 332 and its details
  let hop = -1;
  const placeTip = () => {
    const x = hopS[hop * 3], y = Math.max(70, Math.min(H - 70, hopS[hop * 3 + 1]));
    tip.classList.toggle("left", x > W - 280);
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const pick = (px, py) => {
    let nh = -1, best = 18;
    if (px !== undefined) hopP.forEach((p, k) => { if (hidden(hopS, k * 3)) return; const d = Math.hypot(hopS[k * 3] - px, hopS[k * 3 + 1] - py); if (d < best) { best = d; nh = k; } });
    if (nh === hop) return;
    hop = nh; dirty = true;
    root.classList.toggle("over", hop >= 0);
    tip.hidden = hop < 0;
    if (hop >= 0) {
      const [name, la, lo] = HOPS[hop], dst = hop === HOPS.length - 1;
      tip.lastChild.textContent = [
        (dst ? "dest · reached" : "hop " + String(hop + 1).padStart(2, "0") + " / 08") + " · " + name,
        "rtt " + MS[hop] + "ms · ttl " + (64 - hop),
        Math.abs(la).toFixed(1) + (la < 0 ? "s " : "n ") + Math.abs(lo).toFixed(1) + (lo < 0 ? "w" : "e")
      ].join("\n");
    }
  };

  document.querySelectorAll(".pills button").forEach(b => b.addEventListener("click", () => {
    style = b.dataset.s; root.dataset.style = style;
    document.querySelectorAll(".pills button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    dirty = true; wake();
  }));

  // drag to turn, inertia, no auto spin
  const touches = new Map();
  let pinch = 0;
  root.addEventListener("pointerdown", e => {
    if (e.target.closest(".pills")) return;
    touches.set(e.pointerId, [e.clientX, e.clientY]);
    if (touches.size === 2) { const [a, b] = [...touches.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag = null; return; }
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    root.setPointerCapture(e.pointerId); root.classList.add("grab"); vx = vy = 0;
  });
  root.addEventListener("pointermove", e => {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, [e.clientX, e.clientY]);
    if (touches.size === 2 && pinch) { const [a, b] = [...touches.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoom = Math.max(0.5, Math.min(2.2, zoom * d / pinch)); pinch = d; dirty = true; wake(); return; }
    if (!drag) { pick(e.clientX, e.clientY); wake(); return; }
    const now = performance.now(), dx = e.clientX - drag.x, dy = e.clientY - drag.y, k = 1 / (R || 300);
    rotate(dy * k, dx * k);
    const dt = Math.max(8, now - drag.t), cap = v => Math.max(-0.004, Math.min(0.004, v));
    vx = cap(dy * k / dt); vy = cap(dx * k / dt);
    drag = { x: e.clientX, y: e.clientY, t: now, moved: drag.moved + Math.abs(dx) + Math.abs(dy) };
    if (drag.moved > 4) pick();
    wake();
  });
  const end = e => {
    touches.delete(e.pointerId); if (touches.size < 2) pinch = 0;
    if (!drag) return;
    const tap = drag.moved < 5;
    if (performance.now() - drag.t > 80) vx = vy = 0;
    drag = null; root.classList.remove("grab");
    if (tap) pick(e.clientX, e.clientY);
    wake();
  };
  root.addEventListener("pointerup", end); root.addEventListener("pointercancel", end);
  root.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !drag) { pick(); wake(); } });
  root.addEventListener("wheel", e => { e.preventDefault(); zoom = Math.max(0.5, Math.min(2.2, zoom * Math.exp(-e.deltaY * 0.0012))); pick(); dirty = true; wake(); }, { passive: false });
  addEventListener("resize", () => { size(); wake(); });

  // hex column
  const hexEl = document.getElementById("hex");
  const hexLines = Array.from({ length: 80 }, (_, i) => (0x332000 + i * 16).toString(16).toUpperCase().padStart(6, "0") + " " + ((i * 2654435761) >>> 24).toString(16).padStart(2, "0"));
  hexEl.textContent = hexLines.join("\n");

  // loop: the globe redraws only when something changed; the pulse is a few dots per frame
  let raf = 0, last = 0;
  const frame = now => {
    raf = 0;
    const dt = Math.min(50, now - (last || now)); last = now;
    if (!drag && (vx || vy)) {
      rotate(vx * dt, vy * dt);
      const k = Math.exp(-dt / 320); vx *= k; vy *= k;
      if (Math.abs(vx) + Math.abs(vy) < 0.00002) vx = vy = 0;
    }
    if (dirty) draw();
    f.setTransform(dpr, 0, 0, dpr, 0, 0);
    f.clearRect(0, 0, W, H);
    const anim = !still && !document.hidden;
    if (anim) {
      const n = hopP.length - 1, x = hopS[n * 3], y = hopS[n * 3 + 1];
      if (!hidden(hopS, n * 3)) for (const off of [0, 0.5]) {
        const ph = ((now / 2200) + off) % 1;
        f.strokeStyle = "rgba(255,43,214," + (1 - ph).toFixed(3) + ")"; f.lineWidth = 1.5;
        f.beginPath(); f.arc(x, y, 6 + ph * 30, 0, 7); f.stroke();
      }
      const segs = routeS.length / 3 - 1, t = (now / 7000) % 1;
      for (let k = 0; k < 18; k++) {
        const fi = t * segs - k * 0.6; if (fi < 0) break;
        const i = Math.min(segs - 1, Math.floor(fi)), u = fi - i, o = i * 3;
        if (hidden(routeS, o)) continue;
        const px = routeS[o] + (routeS[o + 3] - routeS[o]) * u, py = routeS[o + 1] + (routeS[o + 4] - routeS[o + 1]) * u;
        f.fillStyle = k ? "rgba(255,43,214," + (0.6 * (1 - k / 18)).toFixed(2) + ")" : "#fff";
        f.beginPath(); f.arc(px, py, k ? 2.6 : 3.6, 0, 7); f.fill();
      }
    }
    if (anim || dirty || vx || vy) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.addEventListener("visibilitychange", wake);
  document.fonts.ready.then(() => { dirty = true; wake(); });
  size(); wake();
})();
