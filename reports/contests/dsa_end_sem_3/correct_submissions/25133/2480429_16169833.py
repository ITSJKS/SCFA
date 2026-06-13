# Your code here
a = input()
v = 'aeiou'
count=0
for i in range(len(a)):
    if a[i] not in v:
        count+=1

print(count)