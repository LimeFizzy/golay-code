# Golay code implementation

### Try it out
To try this implementation you can go to this link https://limefizzy.github.io/golay-code/ and use encoder live without any setup on your local machine.

### File structure
To check out code implementation itself navigate to `src/services` folder, there you'll find all the logic behind this project.

- `constants.ts` - file with all matrixes used for calculations
- `utils.ts` - shared utils
- `encodint.ts` - main encoding logic
- `sendingToChannel.ts`- noisy channel implementation
- `decoding.ts` - decoding logic
- `textFlow.ts` - helper functions fot text encoding/sendingToChannel/decoding operations
- `imageFlow.ts` - helper functions for image encoding/sendingToChannel/decoding operations

### Libraries used
Any additional libraries were used.

### What is done
- Vector of 12 bits encoding/sendingToChannel/decoding
- Text encoding/sendingToChannel/decoding
- Image encoding/sendingToChannel/decoding (decoding of not encoded version of image doesn't fully work)

### Usage of UI
| Binary | Text | Image |
| ----- | ----- | ----- |
|<img width="1440" alt="image" src="https://github.com/user-attachments/assets/f11c2020-2e72-4f3e-8553-e4b842ba8939" />|<img width="1440" alt="image" src="https://github.com/user-attachments/assets/783d4458-43ed-48ba-88cc-0d74dd32f496" />|<img width="1440" alt="image" src="https://github.com/user-attachments/assets/6b3021a4-9cba-4de9-a9fd-f7cfb228ffcc" />|

- This dwopdown allows to choose which scenario to run:


<img width="235" alt="image" src="https://github.com/user-attachments/assets/53ec8549-3872-4c6c-bdc3-6282f549f3a3" />

- Vector input field only accepts 1's and 0's and also reqiures input length be of 12 symbols.
- Text input field doesn't have restrictions exept of message length whis is set to 50 characters.
- Image input also doesn't have limitations **however it is highly recomended to use only 150x150px images** as used elements are in these dimension and also choosing images with higher resolution will affect speed of operations.

- Error posibility field accepts any number [0;1] with up to 5 digits after decimal.

- Message after sending to channel can be edited in binary scenario.

### Decisions made
- For text encoding it is needed to convert it to binary, which I did using symbols ASCII values and converting them to binary with 0's padding at the beginning of each character to acheive desired length of vectors.
- The similar decision was made for image flow. Pixel data(without header) is extracted, converted to RGB values and then RGB values are converted for the following actions with standart(in this case vectors of 12 bits) vectors.
- For sending vectors to channel following algorith is chosen: random number [0;1] is generated for each vector element, it is compared with error possibility and if it is less than that number, bit in vector is changed, if not, old bit stays.

### Experiments
Codeword used: `111111111111`

| Error Probability | Average Errors Introduced | Average percentage of Correct Bits |
|--------------------|---------------------------|-----------------------------|
| 0.00              | 0.00                      | 100.00%                    |
| 0.05              | 1.4                      | 100.00%                     |
| 0.10              | 2.76                      | 98.8%                     |
| 0.20              | 4.33                      | 78.59%                     |
| 0.30              | 5.04                      | 67.70%                     |
| 0.40              | 8.69                      | 58.00%                     |
| 0.50              | 11.35                     | 40.33%                     |
| 0.60              | 13.90                     | 34.81%                     |
| 0.70              | 16.53                     | 22.12%                     |
| 0.80              | 17.95                     | 9.38%                     |
| 0.90              | 21.20                     | 6.40%                     |



