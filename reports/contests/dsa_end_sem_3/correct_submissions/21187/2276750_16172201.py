# Your code here
n=int(input())
arr=[]
for i in range(n):
    
    arr.append(list(map(int,input().split())))
    

# print(arr)
a=[]
b=[]
for i in range(n):
    for j in range(n):
        if i==j:
            a.append(arr[i][j])
        if i+j==n-1 :
            b.append(arr[i][j])
# print(a,b)
a=list(set(a))
b=list(set(b))
# print (a,b)
if len(a)==1 and len(b)==1:
    print("Double Harmony")
else:
    print("No Harmony")