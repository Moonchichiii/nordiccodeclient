interface TypographyScale {
    type: 'fluid' | 'static';
    minScreen: string; 
    maxScreen: string;
    scaleRatio: number;
    fontPairs: FontPair[];
   }
   
   interface FontPair {
    heading: string;
    body: string;
    weights: {
      heading: number[];
      body: number[];
    };
    lineHeight: {
      heading: string;
      body: string;
    };
   }
   