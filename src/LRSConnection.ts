import { Statement } from "./interfaces/Statement";

export class LRSConnection {
  private endpoint: string;
  private headers: Headers;

  public constructor(endpoint: string, auth: string) {
    this.endpoint = endpoint;
    let headers: Headers = new Headers();
    headers.append("X-Experience-API-Version", "1.0.0");
    headers.append("Content-Type", "application/json");
    if (auth) {
      headers.append("Authorization", auth);
    }
    this.headers = headers;
  }

  public getStatements(): Promise<{ statements: Statement[]; more: string }> {
    return this.request(`${this.endpoint}statements`);
  }

  public getStatement(statementId: string): Promise<Statement> {
    return this.request(
      `${this.endpoint}statements?statementId=${statementId}`
    );
  }

  public sendStatement(statement: Statement): Promise<string[]> {
    return this.request(`${this.endpoint}statements`, {
      method: "POST",
      body: JSON.stringify(statement)
    });
  }

  private request(input: RequestInfo, init?: RequestInit | undefined): any {
    return fetch(input, {
      headers: this.headers,
      ...init
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then(error => Promise.reject(error));
      }
    });
  }
}
