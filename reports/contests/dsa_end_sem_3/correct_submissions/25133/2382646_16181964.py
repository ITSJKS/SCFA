# Your code her
s = input()
count = 0

for i in s:
    for char in "aeiou":
        if char == i:
            count += 1

print(len(s) - count)


    # for i in s:

        # if char == i:
            # count += 1
            # print(char)
# print(count)