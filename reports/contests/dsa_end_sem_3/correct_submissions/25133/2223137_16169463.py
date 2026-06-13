# Your code here
s=input()
def count(string):
    vowels='aeiou'
    c=0

    for i in string:
        if i not in vowels:
            c += 1
    return c
print(count(s))