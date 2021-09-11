export class Serializable {
    fromJSON(json: any) {
        for (var propName in json)
            (this as any)[propName] = json[propName] as any;
        return this;
    }
}
