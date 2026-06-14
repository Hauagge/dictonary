import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class WordParamPipe implements PipeTransform<string, string> {
  private readonly pattern = /^[A-Za-z][A-Za-z\s'-]*$/

  transform(value: string): string {
    const word = String(value ?? "").trim()
    if (!word || word.length > 60 || !this.pattern.test(word)) {
      throw new BadRequestException("Invalid word")
    }
    return word.toLowerCase()
  }
}
