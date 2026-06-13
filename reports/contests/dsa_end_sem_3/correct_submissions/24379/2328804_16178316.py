a=int(input())
l=list(map(int,input().split()))
stack=[]
for i in l:
    if not stack or (stack[-1]>0 and i>0) or (stack[-1]<0 and i<0):
        stack.append(i)
    else:
        ad=True
        while stack and  ((i>0 and stack[-1]<0) or (i<0 and stack[-1]>0)):
            if abs(stack[-1])<abs(i):
                stack.pop()
            elif abs(stack[-1])==abs(i):
                stack.pop()
                ad=False
                break
            else:
                ad=False
                break
        if ad:
            stack.append(i)
    






















    # if not stack or (stack[-1]>0 and i>0) or (stack[-1]<0 and i<0):
    #     stack.append(i)
    # else:
    #     while stack:
    #         if (stack[-1]<0 and i<0) or (stack[-1]>=0 and i>=0):
    #             stack.append(i)
    #             break
    #         elif abs(stack[-1])>abs(i):
    #             break
    #         elif abs(stack[-1])<abs(i):
    #             while stack and abs(stack[-1])<abs(i):
    #                 stack.pop()
    #             if stack and (abs(stack[-1])==abs(i) and (i>0 and stack[-1]>0)) or (abs(stack[-1])==abs(i) and (i<0 and stack[-1]<0)):
    #                 pass
    #             elif stack and (abs(stack[-1])==abs(i) and (i>0 and stack[-1]<0)) or (abs(stack[-1])==abs(i) and (i<0 and stack[-1]>0)):
    #                 stack.pop()
    #             else:
    #                 stack.append(i)
    #         elif abs(stack[-1])==abs(i):
    #             stack.pop()
    #         else:
    #             stack.append(i)
print(*stack)