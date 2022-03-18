import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform{
  transform(value: any, limit: number) {
      let returnVal = (value.length > limit 
        ? 
        value.substr(0,limit).toString()+ '...'
        : 
        value );
      return returnVal;
  }
}