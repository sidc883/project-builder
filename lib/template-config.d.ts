export interface TemplateConfig {
    sourceTemplatePath: string;
    destinationPath: string;
    tokens: Array<TemplateConfigToken>;
}

export interface TemplateConfigToken {
    name: string;
    value: string;
}