stack=[]
n=int(input())
arr=list(map(int,input().split()))
for i in arr:
    if not stack:
        stack.append(i)
    elif abs(i)==abs(stack[-1]) and i*-1==stack[-1]:
        stack.pop()
    elif abs(i)<abs(stack[-1]) and (i<0 and stack[-1]<0):
        stack.append(i)
    elif abs(i)<abs(stack[-1]) and (i<0 and stack[-1]>0):
        continue
    elif abs(i)<abs(stack[-1]) and (i>0 and stack[-1]<0):
        stack.append(i)
    elif abs(i)<abs(stack[-1]) and (i>0 and stack[-1]>0):
        stack.append(i)

    elif abs(i)>abs(stack[-1]) and (i<0 and stack[-1]<0):
        stack.append(i)
    elif abs(i)>abs(stack[-1]) and (i>0 and stack[-1]<0):
        stack.append(i)
    elif abs(i)>abs(stack[-1]) and (i>0 and stack[-1]>0):
        stack.append(i)
    
    else:
        while stack and abs(i)>abs(stack[-1]) and (i<0 and stack[-1]>0):
            stack.pop()
        if stack and (i<0 and stack[-1]<0):
            stack.append(i)
        elif stack and (i<0 and stack[-1]>0) and abs(stack[-1])>abs(i):
            continue
        else:
            stack.append(i)
print(*stack)