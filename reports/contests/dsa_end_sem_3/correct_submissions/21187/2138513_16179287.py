# Your code here
n=int(input())
mat=[]
for q in range(n):
    
    arr=list(map(int,input().split()))
    mat.append(arr)
arr2=[]
arr3=[]
for i in range(len(mat)):
    for j in range(len(mat[i])):
        if i==j:
            arr2.append(mat[i][j])
        if i+j==len(mat)-1:
            arr3.append(mat[i][j])
count=0
for i in range(len(arr2)):
    if arr2[i]!=arr2[0]:
        count+=1
for i in range(len(arr3)):
    if arr3[i]!=arr3[0]:
        count+=1 
if count:
    print("No Harmony")
else:
    print("Double Harmony")