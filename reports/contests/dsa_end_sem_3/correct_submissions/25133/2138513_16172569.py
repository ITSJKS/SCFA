# Your code here
S=str(input())
count=0
list1=['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z']
for i in range(len(S)):
    if S[i] in list1:
        count+=1
print(count)