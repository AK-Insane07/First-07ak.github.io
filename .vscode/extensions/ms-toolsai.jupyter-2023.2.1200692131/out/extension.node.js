/*! For license information please see extension.node.js.LICENSE.txt */
                            try:
                                del _VSCODE_getVariable
                            except:
                                pass
                            `;let Zl=Jl=class{constructor(e,t){this.fs=e,this.context=t}async generateCodeToGetVariableInfo(e){const t=await this.getContentsOfScript(),n=e.isDebugging?"True":"False",r=`${Ql}("info", ${n}, ${e.variableName})`;return e.isDebugging?{initializeCode:t,code:r,cleanupCode:Xl}:{code:`${t}\n\n${r}\n\n${Xl}`}}async generateCodeToGetVariableProperties(e){const t=await this.getContentsOfScript(),n=e.isDebugging?"True":"False",r=`${Ql}("properties", ${n}, ${e.variableName}, ${e.stringifiedAttributeNameList})`;return e.isDebugging?{initializeCode:t,code:r,cleanupCode:Xl}:{code:`${t}\n\n${r}\n\n${Xl}`}}async generateCodeToGetVariableTypes(e){const t=`${await this.getContentsOfScript()}\n\n_VSCODE_rwho_ls = %who_ls\n`,n=e.isDebugging?"True":"False",r=Gl()`
        try:
            del _VSCODE_rwho_ls
        except:
            pass
        `,i=`${Ql}("types", ${n}, _VSCODE_rwho_ls)`;return e.isDebugging?{initializeCode:t,code:i,cleanupCode:`${Xl}\n${r}`}:{code:`${t}${i}\n\n${Xl}\n${r}`}}async getContentsOfScript(){if(Jl.contentsOfScript)return Jl.contentsOfScript;const e=Ln(this.context.extensionUri,"pythonFiles","vscode_datascience_helpers","getVariableInfo","vscodeGetVariableInfo.py"),t=await this.fs.readFile(e);return Jl.contentsOfScript=t,t}};Zl=Jl=function(e,t,n,r){var i,o=arguments.length,s=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(o<3?i(s):o>3?i(t,n,s):i(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s}([(0,Ut.b2)(),Yl(0,(0,Ut.f3)(Ko)),Yl(1,(0,Ut.f3)(en))],Zl);var ed,td=function(e,t){return function(n,r){t(n,r,e)}};const nd="_VSCODE_getDataFrame",rd=Gl()`
                            try:
                                del _VSCODE_getDataFrame
                            except:
                                pass
        try:
            import ipywidgets as _VSCODE_ipywidgets
            print("${kg}" + _VSCODE_ipywidgets.__version__)
            del _VSCODE_ipywidgets
        except:
            pass
//# sourceMappingURL=extension.node.js.map