const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOUxQRm54TzhKK0JiaUtEeEI0aDAvU1o1UnVTRzZuVlhZZXUzcmozcm5KUDJrL2hiRC9yUEhtaHAvdlhhaXZpSDl1QlJOKzFNeVNEekVYUUlpRmJrRDV4MEZlTXRwdHBKOTYxaGI2eGcvMHI3akx1SHFlT3cwYTdtMDJmUDRyTTVZZXE2YWpleCtuRngrMVo4SUxWZ3NueEQwSUUrbDBHL2xVUDhBdzF0OEhQOEFvb3VoL3dEZ1IvOEFXcjh5ZjdIMDg5YkcyUDhBMnhYL0FBby9zWFQvQVBud3RmOEF2eXYrRmQvK3FjUCtmdjRITi9iTXY1RDlOdjhBaHJmNE4vOEFSUmREL3dEQWovNjFIL0RXL3dBRy93RG9vdWgvK0JIL0FOYXZ6Si9zWFQvK2ZDMS83OHIvQUlVZjJMcC8vUGhhL3dEZmxmOEFDai9WT0gvUDM4Qi8yeS81RDlOditHdC9nMy8wVVhRLy9Bai9BT3RSL3dBTmIvQnYvb291aC84QWdSLzlhdnpKL3NYVC93RG53dGYrL0svNFVmMkxwLzhBejRXdi9mbGY4S1A5VTRmOC9md0QrMlgvQUNINmJmOEFEVy93Yi82S0xvZi9BSUVmL1dycGZBM3h1OEIvRXpVSnJId3Q0cjB6WEwyR1B6WHQ3U2NNNnBrRGRqMHlSK2RmbEovWXVuLzgrRnIvQU4rVi93QUs5ci9ZdGl0OVAvYUwwcU8zZ2p0ek5wOXlHOHBRdVFOcHdjZGE0c2J3M0hDNGVkZjJsK1ZHOUROSFdxeHA4dTRuN2JmL0FDZFZKLzJMOFA4QTZHSzhocjE3OXR2L0FKT3FrLzdGK0gvME1WdWZzMWZzM2o0d3ZjNnJxMXhKYWFEYXY1ZjduNzg3OTFCN0FkejlLK2h5bkZVc0hsVWExWjJTL3dBenpNWlJuWHhqaEJhbmd0RmZvN04reUY4TlpiQTJ3MGlTTnR1UFBXWStaOWM0eG44SytYZmpsK3l6cXZ3NzFyVDE4UGk0MXl3MUdVeFFva2VaWTN3VHRiSGJBUFB0WFZnOCt3ZU1xZXppM0YrWmxYeTJ2UWp6dlZlUjRYZFdOellsQmMyOHR1WFhjdm1JVjNEMUdlMVQyT2lhaHFsdmMzRnBaWEZ6QmJMdm1raWpMTEdQVmlPbGZkSHhYL1p2dmZpLzRQOEFDRWx2OW0wUFdiRzNFVnl0d01mS1ZHUjhvT1NDQitaclErSGZ3QzFINFdmQi93QVk2S3YyZldOWjFXQ1JFOGpnTmxDcWpMWXhqY1RYSStJc1A3RlNWdWU5clg4N1h2NmFteXl1cDdScC9EYmY1SDU4MVovczI3K3pmYVBzczMyZi9ucjVaMmZuakZmUm43TnY3TjEzckh4QnZUNHkwcWExdE5JVlhOck92RTBoUHlqUFFyd1R4NkN2dG8rRTlGK3cvWWhwVm45bDI3Zks4aGR1UHlwNWh4RlJ3VlZVb1I1Kzd2b0dHeXllSWh6eWZLZmtoWHB2N0k4NFQ5cTN3cEhrL1BwdDZmYmdKWHJIN1duN090ajRMdFI0dDhPUWkzMDVwQWw1YUE4UkZ1akw3WjR4N2l2SVAyVFArVHR2Qi84QTJETDcrU1ZXT3h0TEhaVFVyMHRuK0d1eE9Ib1R3K05qVG1iSDdiZi9BQ2RWSi8yTDhQOEE2R0s5WS9ZMCtLMnZKNVhndXg4T0xmYWNzelhFK3BDWXA5blVqcXcyblBJQUF6WGsvd0MyMy95ZFZKLzJMOFAvQUtHSzd2OEFZdytMMmgrQTlVMWJSTmJtU3hUVXpHOE41SndvWmNqWXg3WjNkZW5GZVhTcGUxeUhTSE8xc3ZudnAyT3ljdVhNZmk1VDd0cGpSbzdLeklyTXB5cEk2ZlNxbHJyV24zcXh0YjN0dk9zbjNESE1yQnZwZzgxZXI4NGFjZHo2alJoUlJSVWpHN0ZERmdvREhxY2NtbHp4MHBhNW03K0puaFN3dnJtenV2RU9uMjExYk50bGhtdUZSa1BwZzFwR0U2bndxNU1wS083c2VFL3RtZURmRk9xZURKOVh0TlozYUJabEd1ZEtFZTA4c0FIM1pPN0JJNDRyNWIvWk0vNU8yOEgvQVBZTXZ2NUpYMEYrMVorMGxvV3RlRTdqd2o0WnV4cU1sMnlpN3Vvd2ZMUkZJYmFDZXBKQTlzWnI1OS9aTS81TzI4SC9BUFlNdnY1Slg2RFNwMTZlUlZGWGp5OXRMTzJtNTgxS1ZPV1l4ZE4zN203KzI3Q1YvYWlhWFBEYUJFTWY4REZlT1Y3WiszRkM2ZnRLUnlGY0kraG9GUHJoeG12RTYraXlEL2tYMHp6TXkvM21SNmo4Q3RGOFZlSmZHdGhjYVRmU1c5cHBVcTNWMWRYRTVFRUVhbkozYzl4a1k5Ni9SWHdiNDIwbnh2cEszMmxYaTNjTzlvdk1DbGR6TGpkZ0hxUGV2eXEwelhMM1M0WjdhQzdudDdTNnd0eEhDKzN6RkJ6ZzE5RCtGZmpoNGZpMUwrMExlU2JSZE04TmFROGVrNmF4K2E1dW5BVXMyM2c5U2VhOHZQTXNxWXlTbkhwdFpmbjN1L2tsZG5YbCtMalFYSyt2OWFlaVB1Nml2emswL3dEYkErSk9uYmgvYWNGMHBKSSswdzdpUGJnaXU3MGo5cC94TDQyK0d2aXhiL1g3ZlJOZnMxaW5zWHQwOHZ6bDNZa1RCSjV3UitWZk1WT0dzWlMxazFhNlhYcTdkajFvNXJRbm9rN24xMTR4OFpXdWdXOGxsQmRXeDhRWEVFaHNMR2FVSzA4Z1VrQ3Z5NThaVGFwY2VLdFVsMXBKSTlVZWRtdUZrKzhHejBydGZGbnhvdWZGM2hQdzZsMzlvUGl2UnJrdkhxd1laYUlqSUI5OTJLNFB4RjRpdi9GV3J6Nm5xYzMyaTltSU1rbU1icSt6eVhLNTVkek9XNzMrVDB0NU5mTThMSDR5T0t0YnAvWDNtWlhvMzdKbi9KMjNnLzhBN0JsOS9KSzg1cjBiOWt6L0FKTzI4SC85Z3krL2tsZG1lZjhBSXZxK242bU9YLzd6QTdYOXZhNnRkTitOZW16WGM4TnFKTksybzgwZ1RkOHd5Qms4MTg1LzhKTHBIL1FWc3Y4QXdJVC9BQnI5YXZHM3dsOEhmRWlTMms4VCtIYkRXNUxjRVJQZHhiaWdQVUExeS84QXd5djhKUDhBb1FkRy93Qy9KL3hyNHJBY1JMQjRlTkQyZDdIdTRqSzNYcXVweld1Zmw3L3drdWtmOUJXeS93REFoUDhBR2ovaEpkSS82Q3RsL3dDQkNmNDErb1gvQUF5djhKUCtoQjBiL3Z5ZjhhUCtHVi9oSi8wSU9qZjkrVC9qWGY4QTYyTC9BSjlmaWMvOWpQOEFuUHk5L3dDRWwwai9BS0N0bC80RUovalIvd0FKTHBIL0FFRmJML3dJVC9HdjFDLzRaWCtFbi9RZzZOLzM1UDhBalIvd3l2OEFDVC9vUWRHLzc4bi9BQm8vMXNYL0FENi9FUDdHZjg1K1hvOFNhUzNUVkxJLzl2Q2Y0MHYvQUFrV2xmOEFRVHMvKy82ZjQxK29rUDdMdnduaGZjbmdMUmxiMThqL0FPdlUvd0R3elY4TGYraEYwYi93SEZQL0FGc1gvUG9YOWpQK2MvTGlQV3RQa0dVdjdWeC9zektmNjE2aCt5SElsNSsxbjRTZUJsblJOTXZpelJuY0Y0VHFSMHI5QUxYOW56NGJXSUlnOEY2UEdEMXhiQ3Q3dzc4Ti9DM2hHN2E2MGJRTlAwMjVaZGhtdDRGVjlwNmpQWEhBL0t1TEhjUnd4bUduUTltMDJkR0h5dVZDcXFuTmV4Ly8yUT09IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNzYyMDAwIiBoZWlnaHQ9Ijc2MjAwMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NjMgLTkyNikiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAwMTA0OTg3IDAgMCAwLjAwMDEwNDk4NyA0NjMgOTI2KSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMCIgdHJhbnNmb3JtPSJzY2FsZSg5NTI1IDk1MjUpIj48L3VzZT48L2c+PC9nPjwvZz48L3N2Zz4=';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOUxQRm54TzhKK0JiaUtEeEI0aDAvU1o1UnVTRzZuVlhZZXUzcmozcm5KUDJrL2hiRC9yUEhtaHAvdlhhaXZpSDl1QlJOKzFNeVNEekVYUUlpRmJrRDV4MEZlTXRwdHBKOTYxaGI2eGcvMHI3akx1SHFlT3cwYTdtMDJmUDRyTTVZZXE2YWpleCtuRngrMVo4SUxWZ3NueEQwSUUrbDBHL2xVUDhBdzF0OEhQOEFvb3VoL3dEZ1IvOEFXcjh5ZjdIMDg5YkcyUDhBMnhYL0FBby9zWFQvQVBud3RmOEF2eXYrRmQvK3FjUCtmdjRITi9iTXY1RDlOdjhBaHJmNE4vOEFSUmREL3dEQWovNjFIL0RXL3dBRy93RG9vdWgvK0JIL0FOYXZ6Si9zWFQvK2ZDMS83OHIvQUlVZjJMcC8vUGhhL3dEZmxmOEFDai9WT0gvUDM4Qi8yeS81RDlOditHdC9nMy8wVVhRLy9Bai9BT3RSL3dBTmIvQnYvb291aC84QWdSLzlhdnpKL3NYVC93RG53dGYrL0svNFVmMkxwLzhBejRXdi9mbGY4S1A5VTRmOC9md0QrMlgvQUNINmJmOEFEVy93Yi82S0xvZi9BSUVmL1dycGZBM3h1OEIvRXpVSnJId3Q0cjB6WEwyR1B6WHQ3U2NNNnBrRGRqMHlSK2RmbEovWXVuLzgrRnIvQU4rVi93QUs5ci9ZdGl0OVAvYUwwcU8zZ2p0ek5wOXlHOHBRdVFOcHdjZGE0c2J3M0hDNGVkZjJsK1ZHOUROSFdxeHA4dTRuN2JmL0FDZFZKLzJMOFA4QTZHSzhocjE3OXR2L0FKT3FrLzdGK0gvME1WdWZzMWZzM2o0d3ZjNnJxMXhKYWFEYXY1ZjduNzg3OTFCN0FkejlLK2h5bkZVc0hsVWExWjJTL3dBenpNWlJuWHhqaEJhbmd0RmZvN04reUY4TlpiQTJ3MGlTTnR1UFBXWStaOWM0eG44SytYZmpsK3l6cXZ3NzFyVDE4UGk0MXl3MUdVeFFva2VaWTN3VHRiSGJBUFB0WFZnOCt3ZU1xZXppM0YrWmxYeTJ2UWp6dlZlUjRYZFdOellsQmMyOHR1WFhjdm1JVjNEMUdlMVQyT2lhaHFsdmMzRnBaWEZ6QmJMdm1raWpMTEdQVmlPbGZkSHhYL1p2dmZpLzRQOEFDRWx2OW0wUFdiRzNFVnl0d01mS1ZHUjhvT1NDQitaclErSGZ3QzFINFdmQi93QVk2S3YyZldOWjFXQ1JFOGpnTmxDcWpMWXhqY1RYSStJc1A3RlNWdWU5clg4N1h2NmFteXl1cDdScC9EYmY1SDU4MVovczI3K3pmYVBzczMyZi9ucjVaMmZuakZmUm43TnY3TjEzckh4QnZUNHkwcWExdE5JVlhOck92RTBoUHlqUFFyd1R4NkN2dG8rRTlGK3cvWWhwVm45bDI3Zks4aGR1UHlwNWh4RlJ3VlZVb1I1Kzd2b0dHeXllSWh6eWZLZmtoWHB2N0k4NFQ5cTN3cEhrL1BwdDZmYmdKWHJIN1duN090ajRMdFI0dDhPUWkzMDVwQWw1YUE4UkZ1akw3WjR4N2l2SVAyVFArVHR2Qi84QTJETDcrU1ZXT3h0TEhaVFVyMHRuK0d1eE9Ib1R3K05qVG1iSDdiZi9BQ2RWSi8yTDhQOEE2R0s5WS9ZMCtLMnZKNVhndXg4T0xmYWNzelhFK3BDWXA5blVqcXcyblBJQUF6WGsvd0MyMy95ZFZKLzJMOFAvQUtHSzd2OEFZdytMMmgrQTlVMWJSTmJtU3hUVXpHOE41SndvWmNqWXg3WjNkZW5GZVhTcGUxeUhTSE8xc3ZudnAyT3ljdVhNZmk1VDd0cGpSbzdLeklyTXB5cEk2ZlNxbHJyV24zcXh0YjN0dk9zbjNESE1yQnZwZzgxZXI4NGFjZHo2alJoUlJSVWpHN0ZERmdvREhxY2NtbHp4MHBhNW03K0puaFN3dnJtenV2RU9uMjExYk50bGhtdUZSa1BwZzFwR0U2bndxNU1wS083c2VFL3RtZURmRk9xZURKOVh0TlozYUJabEd1ZEtFZTA4c0FIM1pPN0JJNDRyNWIvWk0vNU8yOEgvQVBZTXZ2NUpYMEYrMVorMGxvV3RlRTdqd2o0WnV4cU1sMnlpN3Vvd2ZMUkZJYmFDZXBKQTlzWnI1OS9aTS81TzI4SC9BUFlNdnY1Slg2RFNwMTZlUlZGWGp5OXRMTzJtNTgxS1ZPV1l4ZE4zN203KzI3Q1YvYWlhWFBEYUJFTWY4REZlT1Y3WiszRkM2ZnRLUnlGY0kraG9GUHJoeG12RTYraXlEL2tYMHp6TXkvM21SNmo4Q3RGOFZlSmZHdGhjYVRmU1c5cHBVcTNWMWRYRTVFRUVhbkozYzl4a1k5Ni9SWHdiNDIwbnh2cEszMmxYaTNjTzlvdk1DbGR6TGpkZ0hxUGV2eXEwelhMM1M0WjdhQzdudDdTNnd0eEhDKzN6RkJ6ZzE5RCtGZmpoNGZpMUwrMExlU2JSZE04TmFROGVrNmF4K2E1dW5BVXMyM2c5U2VhOHZQTXNxWXlTbkhwdFpmbjN1L2tsZG5YbCtMalFYSyt2OWFlaVB1Nml2emswL3dEYkErSk9uYmgvYWNGMHBKSSswdzdpUGJnaXU3MGo5cC94TDQyK0d2aXhiL1g3ZlJOZnMxaW5zWHQwOHZ6bDNZa1RCSjV3UitWZk1WT0dzWlMxazFhNlhYcTdkajFvNXJRbm9rN24xMTR4OFpXdWdXOGxsQmRXeDhRWEVFaHNMR2FVSzA4Z1VrQ3Z5NThaVGFwY2VLdFVsMXBKSTlVZWRtdUZrKzhHejBydGZGbnhvdWZGM2hQdzZsMzlvUGl2UnJrdkhxd1laYUlqSUI5OTJLNFB4RjRpdi9GV3J6Nm5xYzMyaTltSU1rbU1icSt6eVhLNTVkek9XNzMrVDB0NU5mTThMSDR5T0t0YnAvWDNtWlhvMzdKbi9KMjNnLzhBN0JsOS9KSzg1cjBiOWt6L0FKTzI4SC85Z3krL2tsZG1lZjhBSXZxK242bU9YLzd6QTdYOXZhNnRkTitOZW16WGM4TnFKTksybzgwZ1RkOHd5Qms4MTg1LzhKTHBIL1FWc3Y4QXdJVC9BQnI5YXZHM3dsOEhmRWlTMms4VCtIYkRXNUxjRVJQZHhiaWdQVUExeS84QXd5djhKUDhBb1FkRy93Qy9KL3hyNHJBY1JMQjRlTkQyZDdIdTRqSzNYcXVweld1Zmw3L3drdWtmOUJXeS93REFoUDhBR2ovaEpkSS82Q3RsL3dDQkNmNDErb1gvQUF5djhKUCtoQjBiL3Z5ZjhhUCtHVi9oSi8wSU9qZjkrVC9qWGY4QTYyTC9BSjlmaWMvOWpQOEFuUHk5L3dDRWwwai9BS0N0bC80RUovalIvd0FKTHBIL0FFRmJML3dJVC9HdjFDLzRaWCtFbi9RZzZOLzM1UDhBalIvd3l2OEFDVC9vUWRHLzc4bi9BQm8vMXNYL0FENi9FUDdHZjg1K1hvOFNhUzNUVkxJLzl2Q2Y0MHYvQUFrV2xmOEFRVHMvKy82ZjQxK29rUDdMdnduaGZjbmdMUmxiMThqL0FPdlUvd0R3elY4TGYraEYwYi93SEZQL0FGc1gvUG9YOWpQK2MvTGlQV3RQa0dVdjdWeC9zektmNjE2aCt5SElsNSsxbjRTZUJsblJOTXZpelJuY0Y0VHFSMHI5QUxYOW56NGJXSUlnOEY2UEdEMXhiQ3Q3dzc4Ti9DM2hHN2E2MGJRTlAwMjVaZGhtdDRGVjlwNmpQWEhBL0t1TEhjUnd4bUduUTltMDJkR0h5dVZDcXFuTmV4Ly8yUT09IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNzYyMDAwIiBoZWlnaHQ9Ijc2MjAwMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NjMgLTkyNikiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAwMTA0OTg3IDAgMCAwLjAwMDEwNDk4NyA0NjMgOTI2KSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMCIgdHJhbnNmb3JtPSJzY2FsZSg5NTI1IDk1MjUpIj48L3VzZT48L2c+PC9nPjwvZz48L3N2Zz4=';

//メニューで使う配列
const PinMenu = {
    PIN1: '1',
    PIN2: '2',
    PIN3: '3',
    PIN4: '4',
    PIN5: '5'
}
const OnOffMenu = {
    OFF: "0",     //数字の場合も「文字列」扱いしないとエラーが出る
    ON:  "1"
}

//クラス定義
class Microcom {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    //ドロップボックスメニュー (PinMenu) 
    static get PinMenu () {
        return PinMenu;
    }
    get MENU1 () {
        return [
            {
                text: '1',
                value: PinMenu.PIN1
            },
            {
                text: '2',
                value: PinMenu.PIN2
            },
            {
                text: '3',
                value: PinMenu.PIN3
            },
            {
                text: '4',
                value: PinMenu.PIN4
            },
            {
                text: '5',
                value: PinMenu.PIN5
            }
        ];
    }

    //ドロップボックスメニュー  
    static get OnOffMenu () {
        return OnOffMenu;
    }
    get MENU2 () {
        return [
            {
                text: '1',
                value: OnOffMenu.ON
            },
            {
                text: '0',
                value: OnOffMenu.OFF
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'microcom',
            name:formatMessage({
                id: 'microcom.name',
                default: 'Microcom'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode :'gpio_output_init',
                    text: formatMessage({
                        id: 'microcom.gpio_output_init',
                        default:'GPIO (output): initialize [NUM1]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 13
                        },
                    }
                },
                {                    
                    opcode :'gpio_output',
                    text: formatMessage({
			id: 'microcom.gpio_output',
                        default:'GPIO (output): set [NUM1]pin [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 13
                        },                        
                        VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: OnOffMenu.OFF
                        },
                        
                    }
                },
                {                    
                    opcode :'gpio_input_init',
                    text: formatMessage({
                        id: 'microcom.gpio_input_init',
                        default:'GPIO (input): initialize [NUM1]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 34
                        },
                    }
                },
                {                    
                    opcode :'gpio_input',
                    text: formatMessage({
			id: 'microcom.gpio_input',
                        default:'GPIO (input): read value from [NUM1]pin',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 34
                        },
                    }
                },
                {                    
                    opcode :'pwm_init',
                    text: formatMessage({
                        id: 'microcom.pwm_init',
                        default:'PWM: initialize [NUM1]pin (timer: [NUM2], channel: [NUM3], frequency: [NUM4])',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        NUM3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        NUM4: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                    }
                },
                {                    
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'microcom.pwm_duty',
                        default:'PWM: set [NUM1]pin duty [VALUE] %',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        
                    }
                },
                {
                    opcode :'pwm_frequency',
                    text: formatMessage({
                        id: 'microcom.pwm_frequency',
                        default:'PWM: set [NUM1]pin frequency [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 440
                        },
                        
                    }
                },
                {
                    opcode :'pwm_pulse',
                    text: formatMessage({
                        id: 'microcom.pwm_pulse',
                        default:'PWM: set [NUM1]pin pulse [VALUE] us',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                        
                    }
                },
                {                    
                    opcode :'adc_init',
                    text: formatMessage({
                        id: 'microcom.adc_init',
                        default:'ADC: initialize [NUM1]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 39
                        },
                    }
                },
                {
                    opcode :'adc_volt',
                    text: formatMessage({
                        id: 'microcom.adc_volt',
                        default:'ADC: read value from [NUM1]pin',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {                     
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 39
                        },
                        
                    }
                },
                {
                    opcode: 'i2c_init',
                    text: formatMessage({
                        id: 'microcom.i2c_init',
                        default: 'I2C: initialize [NUM1]pin as SCL and [NUM2]pin as SDA' 
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 23
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 22
                        }
                    }
                },
                {
                    opcode: 'i2c_write',
                    text: formatMessage({
                        id: 'microcom.i2c_write',
                        default: 'I2C (output): address 0x[NUM1], command 0x[NUM2], value 0x[NUM3]'
                    }),		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 10
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 40
                        },
                        NUM3: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 20
                        }
                    }
                },		
                {
                    opcode: 'i2c_read',
                    text: formatMessage({
                        id: 'microcom.i2c_read',
                        default: 'I2C (input): address 0x[NUM1], number of bytes [NUM2]'
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 10
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        }
                    }
                },		
                {
                    opcode: 'uart_init',
                    text: formatMessage({
                        id: 'microcom.uart_init',
                        default: 'UART-[TEXT]: initiralize (Bourate: [NUM])',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
			},
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9600
			}			
                    }
                },
                {
                    opcode: 'uart_write',
                    text: formatMessage({
                        id: 'microcom.uart_write',
                        default: 'UART-[TEXT1] (output): [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
			},
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "xxxxx"
                        }
                    }
                },
                {
                    opcode: 'uart_read',
                    text: formatMessage({
                        id: 'microcom.uart_read',
                        default: 'UART-[TEXT] (input)',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
			}
                    }
                }		
            ],
	    
	    //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
		menu1: {
		    acceptReporters: true,
                    items: this.MENU1
                },
                menu2:{
                    acceptReporters: false,
                    items:this.MENU2
                }
            }
        };
    }

    gpio_output_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    gpio_output (args) {
        const num1  = Cast.toString(args.NUM1);
        const value = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(value);
    }   

    gpio_input_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    gpio_input (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }   

    pwm_init (args) {
        const num1  = Cast.toString(args.NUM1);
        const num2  = Cast.toString(args.NUM2);
        const num3  = Cast.toString(args.NUM3);
        const num4  = Cast.toString(args.NUM4);
        log.log(num1);
        log.log(num2);
        log.log(num3);
        log.log(num4);
    }
 
    pwm_duty (args) {
        const num1  = Cast.toString(args.NUM1);
        const val   = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(val);
    }   

    pwm_frequency (args) {
        const num1  = Cast.toString(args.NUM1);
        const val   = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(val);
    }   

    adc_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }
    
    adc_volt (args) {
        const num1  = Cast.toString(args.VALUE);
        log.log(num1);
    }   
    
    i2c_init (args) {
        const num1  = Cast.toString(args.NUM1);
        const num2  = Cast.toString(args.NUM2);
        log.log(num1);
        log.log(num2);
    }
    
    i2c_write (args) {
        const num1  = Cast.toString(args.NUM1);
        const num2  = Cast.toString(args.NUM2);
        const num3  = Cast.toString(args.NUM3);
        log.log(num1);
        log.log(num2);
        log.log(num3);
    }

    i2c_read (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    uart_init (args) {
        const text  = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    uart_write (args) {
        const text1  = Cast.toString(args.TEXT1);
        const text2  = Cast.toString(args.TEXT2);
        log.log(text1);
        log.log(text2);
    }

    uart_read (args) {
        const text  = Cast.toString(args.TEXT);
        log.log(text);
    }

}

module.exports = Microcom
