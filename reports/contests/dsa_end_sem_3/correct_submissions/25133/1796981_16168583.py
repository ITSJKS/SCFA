# Your code here
s=input()
st='aeiou'
count=0
for ch in s:
    if ch not in st:
        count+=1
print(count)